import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';
import { FacebookBase } from './facebook.base';

export class FacebookOldGroupPoster extends FacebookBase implements IChannel{
  
    constructor(private postPages:string[], credentials:{username:string,password:string},private imagesToPost:PostImage[],private content:string){
        super(credentials);
        if(!postPages || postPages.length === 0){
            throw "Invalid Post pages given to FacebookGroupPoster";
        }
        if(!credentials || !credentials.username || !credentials.password){
            throw "Invalid Credentials Object given to FacebookGroupPoster";
        }
    }

    public getImagesToPost(){
      return this.imagesToPost.filter((i)=> i.selected == true).map((i) => i.imageURL);
    }
  
    public getPostPages():Array<string>{//override
        return this.postPages;
    }

    public async run(onPageUploadedCallback:Function|null=null):Promise<boolean>{
        this.timeout  = await ConfigHelper.getConfigValue<number>('navigation_timeout', this.timeout );
        let browser     = await this.lunchBrowser();
        let loginPage   = await this.login(browser);
        let postedPages = await this.postToPages(browser,onPageUploadedCallback);
        await ScreenshootHelper.takeSuccessScreenShot('FB-OLD-GROUP-POST',this.Browser);
        if((ConfigHelper.getConfigValue('headless',false) ) === true || ConfigHelper.getConfigValue('close_browser')){
           await browser.close();
        }

        return true;
    }

    private async postToPages(browser:puppeteer.Browser,onPageUploadedCallback:Function|null=null):Promise<puppeteer.Page[]>{
        let pages:puppeteer.Page[] = [];
        let count = 0;
        for(let group of this.getPostPages()){
            count++;

            const groupPage = await browser.newPage();
            // await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            await groupPage.goto(group,{ waitUntil: 'networkidle2',timeout:this.timeout });
            await groupPage.keyboard.press('p');
            // await groupPage.click('textarea#js_1g');

            await groupPage.keyboard.type(this.content);   // click submit
            await this.delay(2000);

            await groupPage.click('a[label="Photo/Video"]');
            await this.delay(500);
            
            // var elementHandle = await groupPage.click('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');

            const fileInputSelector = 'input[aria-label="Add Photo or Video"]';
            const inputUploadHandles = await groupPage.$$(fileInputSelector);
            if( inputUploadHandles.length == 0){
                throw('Unable to find image upload input selector: '+fileInputSelector)
            }

            const inputUploadHandle  = inputUploadHandles[0];//5

            let filesToUpload        = this.getImagesToPost();
            // console.log('Post Images',filesToUpload);
            await this.delay(100);

            // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
            // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
            // Sets the value of the file input to fileToUpload
            // for(let fileToUpload of filesToUpload){
            //     await inputUploadHandle.uploadFile(fileToUpload);
            //     await this.delay(500);
            // }
            await inputUploadHandle.uploadFile(...filesToUpload);
            // await this.delay(2000);
            
            let postButtonQuery ='button[type=submit]._1mf7';
            let postButton = await groupPage.$$(postButtonQuery);

            while(true){
                // postButton = await groupPage.$x(postButtonXPath);
                let disabledJSHandle = await postButton[0].getProperty('attributes');
                let disabledValue = await disabledJSHandle.jsonValue();//when the disabled attribute is not present only 3 values are present
                // console.log('disabled attributes' , disabledValue);
                // postButton[0].
                // console.log(disabledValue);
                if(
                    typeof disabledValue['3'] === 'undefined'
                ){
                    break;
                }
                await this.delay(100);
            }

            await groupPage.click(postButtonQuery);
            
            if(onPageUploadedCallback !== null){
                onPageUploadedCallback(groupPage,count);
            }

            pages.push(groupPage);
        }
        return pages;
    }


}
