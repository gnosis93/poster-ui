import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class FacebookOldGroupPoster extends ChannelBase implements IChannel{
    private readonly channelUrl:string = 'https://facebook.com/';
    private readonly channelLoginUrl:string = 'https://en-gb.facebook.com/login/';
    private timeout:number = 10000;//default timeout

    constructor(private postPages:string[],private credentials:{username:string,password:string},private imagesToPost:PostImage[],private content:string){
        super();
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

    public getCredentials(){//override
        return this.credentials;
    }

    public getPostPages():Array<string>{//override
        return this.postPages;
    }

    private async login(browser:puppeteer.Browser):Promise<puppeteer.Page>{
        let loginPage = await browser.newPage();
        let {username,password} = this.getCredentials();

        await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await loginPage.goto(this.channelLoginUrl , { waitUntil: 'networkidle2' ,timeout:this.timeout });
        await loginPage.type('#email', username);
        await loginPage.type('#pass' , password);
        await loginPage.click('#loginbutton');
        await loginPage.waitForNavigation({timeout: this.timeout });

        return loginPage;

    }

    public async run(onPageUploadedCallback:Function|null=null):Promise<boolean>{
        this.timeout  = await ConfigHelper.getConfigValue<number>('navigation_timeout', this.timeout );
        let browser     = await this.lunchBrowser();
        let loginPage   = await this.login(browser);
        let postedPages = await this.postToPages(browser,onPageUploadedCallback);
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
            await groupPage.click('a[loggingname="media_tab_selector"]');
            await this.delay(500);
            
            // var elementHandle = await groupPage.click('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
            const inputUploadHandles = await groupPage.$$('input[type=file]');
            console.log(inputUploadHandles);
            const inputUploadHandle  = inputUploadHandles[1];//5

            let filesToUpload        = this.getImagesToPost();
            // console.log('Post Images',filesToUpload);
            await this.delay(100);

            // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
            // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
            // Sets the value of the file input to fileToUpload
            // for(let fileToUpload of filesToUpload){
            //     await inputUploadHandle.uploadFile(fileToUpload);
            // }
            await inputUploadHandle.uploadFile(...filesToUpload);

            await this.delay(2000);
            
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
