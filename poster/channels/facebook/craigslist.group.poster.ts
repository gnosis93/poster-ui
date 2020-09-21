import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class CraigslistPoster extends ChannelBase implements IChannel{
    private readonly channelUrl:string = 'https://craigslist.com/';
    private readonly channelLoginUrl:string = 'https://accounts.craigslist.org/login';

    constructor(
        private credentials:{username:string,password:string},
        private imagesToPost:PostImage[],
        private content:string,
        private title:string='Test Title',
        private location:string='Test Location',
        private price:string,
        private surfaceArea:string,
        private phoneNumber:string,
        private phoneExtension:string='+356'
    ){
        super();
       
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

 

    private async login(browser:puppeteer.Browser):Promise<puppeteer.Page>{
        let loginPage = await browser.newPage();
        let {username,password} = this.getCredentials();

        await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await loginPage.goto(this.channelLoginUrl , { waitUntil: 'networkidle2' });
        await loginPage.type('#inputEmailHandle', username);
        await loginPage.type('#inputPassword' , password);
        await loginPage.click('#login');
        // await loginPage.waitForNavigation();

        return loginPage;

    }

    public async run(onPageUploadedCallback:Function|null=null):Promise<boolean>{
        let browser     = await this.lunchBrowser();
        let loginPage   = await this.login(browser);
        await this.postToPages(loginPage,onPageUploadedCallback);

        if((ConfigHelper.getConfigValue('headless',false) ) === true){
           await browser.close();
        }

        return true;
    }

    private async postToPages(page:puppeteer.Page,onPageUploadedCallback:Function|null=null):Promise<puppeteer.Page>{
        let count = 0;
        
        // let page = (await browser.newPage())
        await page.goto('https://post.craigslist.org/c/bkk',{
            waitUntil: "networkidle2",
            timeout: 0
        });

        await page.setDefaultNavigationTimeout(0);
        // page.click('.selection-list li')[6]

        
        page = await this.clickTickbox(page,'housing offered')
        page = await this.clickTickbox(page,'real estate - by broker')
        
        await page.click('button[type=submit]');
        this.delay(500);
        // await page.waitForNavigation(
        //     {
        //         waitUntil: "networkidle2",
        //         timeout: 0
        //     }
        // );


        await page.type("#PostingTitle",this.title);
        await page.type("#geographic_area",this.location);
        await page.type("#PostingBody",this.content);
        await page.type("input[name='price']",this.price);

        await this.threeClickType(page,"input[name='surface_area']",this.surfaceArea);
        // await page.type("input[name='surface_area']",'');
        
        await page.select("select[name='housing_type']", '2');
        
        await this.clickTickbox(page,'show my phone number',false);
        this.delay(500);
        await page.type("input[name='contact_phone']",this.phoneNumber);
        await page.type("input[name='contact_phone_extension']",this.phoneExtension);

        
        await this.clickTickbox(page,'furnished',false);
        await this.delay(500);
        await page.click('button[type=submit]');
        await this.delay(500);

        await page.waitForSelector('.imgcount')
        
        // await page.waitForNavigation();

        const inputUploadHandles = await page.$$('input[type=file]');
        const inputUploadHandle  = inputUploadHandles[0];
        let filesToUpload        = this.getImagesToPost();
        await inputUploadHandle.uploadFile(...filesToUpload);

        let imageCount = (await this.getImageCount(page));
        while(imageCount < filesToUpload.length){
            await this.delay(100);
            imageCount = (await this.getImageCount(page));
        }


        await page.click('button[type=submit].done');

        return page;
    }

    private async threeClickType(page:puppeteer.Page,selector:string,value:string){
        const input = await page.$(selector);
        await input.click({ clickCount: 3 });//selects all text in input thus causing it to be deleted
        await input.type(value);
    }

    private async getImageCount(page:puppeteer.Page){
        let element = await page.$('.imgcount')
        let value = await page.evaluate(el => el.textContent, element)
        return value;
    }

    private async clickTickbox(page:puppeteer.Page,selectionText:string,awaitNavigation:boolean=true){
        const linkHandlers = await page.$x("//span[contains(text(), '"+selectionText+"')]");
        if (linkHandlers.length > 0) {
            await linkHandlers[0].click();
        } else {
            throw new Error("Link not found");
        }

        if(awaitNavigation){
            await page.waitForNavigation();
        }

        return page;
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
