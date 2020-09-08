import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';

export class FacebookGroupPoster extends ChannelBase implements IChannel{
    private readonly channelUrl:string = 'https://facebook.com/';

    constructor(private postPages:string[],private credentials:{username:string,password:string},private imagesToPost:string[],private content:string){
        super();
        if(!postPages || postPages.length === 0){
            throw "Invalid Post pages given to FacebookGroupPoster";
        }
        if(!credentials || !credentials.username || !credentials.password){
            throw "Invalid Credentials Object given to FacebookGroupPoster";
        }
    }

    public getImagesToPost(){
        return this.imagesToPost;
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
        await loginPage.goto(this.channelUrl , { waitUntil: 'networkidle2' });
        await loginPage.type('#email', username);
        await loginPage.type('#pass' , password);
        await loginPage.click('#u_0_d');
        await loginPage.waitForNavigation();

        return loginPage;

    }

    public async run(onPageUploadedCallback:Function|null=null):Promise<boolean>{
        let browser     = await this.lunchBrowser();
        let loginPage   = await this.login(browser);
        let postedPages = await this.postToPages(browser,onPageUploadedCallback);

        if((ConfigHelper.getConfigValue('headless',false) ) === true){
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
            await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            await groupPage.goto(group,{ waitUntil: 'networkidle2' });
            await groupPage.click('.kbf60n1y');

            await this.delay(1000);
            await groupPage.keyboard.type(this.content);   // click submit
            // var elementHandle = await groupPage.click('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
            const inputUploadHandles = await groupPage.$$('input[type=file]');
            const inputUploadHandle  = inputUploadHandles[2];
            let filesToUpload        = this.getImagesToPost();
            
            await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
            // Sets the value of the file input to fileToUpload
            for(let fileToUpload of filesToUpload){
                await inputUploadHandle.uploadFile(fileToUpload);
            }

            await this.delay(1000);

            await groupPage.click('div[aria-label="Post"]');

            if(onPageUploadedCallback !== null){
                onPageUploadedCallback(groupPage,count);
            }

            pages.push(groupPage);
        }
        return pages;
    }

   
    
    async lunchBrowser():Promise<puppeteer.Browser>{//override
        let config = ConfigHelper.getConfig();
        
        return puppeteer.launch({
            executablePath:ConfigHelper.getConfigValue('chrome_executable_path'),
            headless: ConfigHelper.getConfigValue('headless',false), 
            defaultViewport: null, 
            args: ['--start-maximized',"--disable-notifications"] 
        });
        
    } 

}