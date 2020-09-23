import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class CraigslistPoster extends ChannelBase implements IChannel {
    private readonly channelUrl: string = 'https://craigslist.com/';
    private readonly channelLoginUrl: string = 'https://accounts.craigslist.org/login';

    private readonly locationsPostUrls = [
        {
            'city': "bangkok",
            'url': "https://post.craigslist.org/c/bkk?lang=en&cc=gb"

        },
        {
            'city': "beijing",
            'url': "https://post.craigslist.org/c/pek?lang=en&cc=gb"
        }

    ];


    constructor(
        private credentials: { username: string, password: string },
        private imagesToPost: PostImage[],
        private content: string,
        private title: string,
        private location: string,
        private price: string,
        private surfaceArea: string,
        private phoneNumber: string,
        private phoneExtension: string,
        private city: string,
        private immediatelyPost
    ) {
        super();

        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookGroupPoster";
        }
    }

    private getCityUrl(): string {
        if (!this.city || this.city.length === 0) {
            throw 'City in Criagslist poster is a required param'
        }

        let city = this.locationsPostUrls.find((c) => c.city == this.city);
        if (!city) {
            throw 'Invalid City given to Criagslist poster, given INVALID city name: ' + this.city;
        }

        return city.url;
    }

    public getImagesToPost() {
        return this.imagesToPost.filter((i) => i.selected == true).map((i) => i.imageURL);
    }

    public getCredentials() {//override
        return this.credentials;
    }



    private async login(browser: puppeteer.Browser): Promise<puppeteer.Page> {
        let loginPage = await browser.newPage();
        let { username, password } = this.getCredentials();

        await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await loginPage.goto(this.channelLoginUrl, { waitUntil: 'networkidle2' });
        await loginPage.type('#inputEmailHandle', username);
        await loginPage.type('#inputPassword', password);
        await loginPage.click('#login');
        // await loginPage.waitForNavigation();

        return loginPage;

    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        let browser = await this.lunchBrowser();
        let loginPage = await this.login(browser);
        await this.postToPages(loginPage, onPageUploadedCallback);

        if ((ConfigHelper.getConfigValue('headless', false)) === true) {
            await browser.close();
        }

        return true;
    }

    private async postToPages(page: puppeteer.Page, onPageUploadedCallback: Function | null = null): Promise<puppeteer.Page> {
        let count = 0;

        // let page = (await browser.newPage())
        // 'https://post.craigslist.org/c/pek?lang=en&cc=gb'
        //'https://post.craigslist.org/c/bkk'
        let cityPostURL = this.getCityUrl();
        await page.goto(cityPostURL, {
            waitUntil: "networkidle2",
            timeout: 0
        });

        await page.setDefaultNavigationTimeout(10000);
        // page.click('.selection-list li')[6]



        await this.clickTickboxByIndex(page, 3);
        await page.waitForSelector('button[type=submit]');
        await page.click('button[type=submit]');
        // this.delay(2000);
        await page.waitForSelector('.option-label');
        
        await this.clickTickboxByIndex(page, 3, '.option-label');
        // this.delay(2000);

        // await Promise.all([
        await page.waitForSelector('button[type=submit]');

        await page.click('button[type=submit]');
          
        await page.waitForSelector("#PostingTitle");

        await this.threeClickType(page,"#PostingTitle",this.title);
        await this.threeClickType(page,"#geographic_area",this.location);
        await this.threeClickType(page,"#PostingBody",this.content);
        await this.threeClickType(page,"input[name='price']",this.price);

        await this.threeClickType(page, "input[name='surface_area']", this.surfaceArea);

        let fromEmailFieldExists = await page.$("input[name='FromEMail'][type='email']");
        if(fromEmailFieldExists !== null){
            await this.threeClickType(page, "input[name='FromEMail']", this.credentials.username);
        }


        // await page.type("input[name='surface_area']",'');

        await page.select("select[name='housing_type']", '2');

        // await this.clickTickbox(page,'show my phone number',false);
        // this.delay(500);

        await page.click('input.show_phone_ok');

        await page.type("input[name='contact_phone']", this.phoneNumber);
        await page.type("input[name='contact_phone_extension']", this.phoneExtension);

        await page.click('input.is_furnished');

        // await this.clickTickbox(page,'furnished',false);
        // await this.delay(500);
        // await page.click('button[type=submit]');
        // await this.delay(500);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            await page.click('button[type=submit]'),

        ])
      
        console.log('wating for imgcount');
        await page.waitForSelector('.imgcount')
        console.log('READY WITH: wating for imgcount');

        // await page.waitForNavigation();

        // let clickUpload = await page.waitForSelector('a.newupl');
        // await clickUpload.click();
        
        await page.waitForSelector('input[type=file]');
        const inputUploadHandles = await page.$$('input[type=file]');
        const inputUploadHandle  = inputUploadHandles[0];
        let filesToUpload        = this.getImagesToPost();
        await inputUploadHandle.uploadFile(...filesToUpload);

        // const inputUploadHandle = await page.$('input[type=file]');
        // let filesToUpload = this.getImagesToPost();
        // console.log('files to upload',filesToUpload);
        // for(let file of filesToUpload){
        //     await this.delay(100);
        //     await inputUploadHandle.uploadFile(file);

        // }
        // await inputUploadHandle.uploadFile(...filesToUpload);
        
        let imageCount = (await this.getImageCount(page));
        while (imageCount < filesToUpload.length) {
            await this.delay(500);
            imageCount = (await this.getImageCount(page));
            console.log('wating image count')
        }


        await page.click('button[type=submit].done');

        if(this.immediatelyPost){
            await page.waitForSelector("button[name='go']");
            await page.click("button[name='go']");
        }
        
        return page;
    }

    private async threeClickType(page: puppeteer.Page, selector: string, value: string) {
        const input = await page.$(selector);
        if(input === null){
            throw 'ThreeClickType Exception: unable to find specfied selector: '+selector
        }
        await input.click({ clickCount: 3 });//selects all text in input thus causing it to be deleted
        await input.type(value);
    }

    private async getImageCount(page: puppeteer.Page) {
        let element = await page.$('.imgcount')
        let value = await page.evaluate(el => el.textContent, element)
        return value;
    }

    private async clickTickbox(page: puppeteer.Page, selectionText: string, awaitNavigation: boolean = true) {
        const linkHandlers = await page.$x("//span[contains(text(), '" + selectionText + "')]");
        if (linkHandlers.length > 0) {
            await linkHandlers[0].click();
        } else {
            throw new Error("Link not found");
        }

        if (awaitNavigation) {
            await page.waitForNavigation();
        }

        return page;
    }


    private async clickTickboxByIndex(page: puppeteer.Page, selectionIndex: number, querySelector = ".selection-list>li>label>.right-side", awaitNavigation: boolean = true) {
        // const linkHandlers = await page.$(querySelector);
        console.log('start');

        let result = false;
        let elements = await page.$$(querySelector);
        for (let [i, link] of (elements.entries())) {
            if (i == selectionIndex) {
                // console.log('Selected index' + selectionIndex, link);
                await link.click();
                result = true;
                // await page.waitForNavigation({ waitUntil: 'load' });
                break;
            } else {
                result = false
            }
        }

        if (result) {
            return true;
            // await linkHandlers[0].click();
        } else {
            await this.delay(500);
            return await this.clickTickboxByIndex(page, selectionIndex, querySelector, awaitNavigation)
            // throw new Error("Link By Index: "+selectionIndex+". not found");
        }

        return false;
    }

    async lunchBrowser(): Promise<puppeteer.Browser> {//override
        let config = ConfigHelper.getConfig();

        return puppeteer.launch({
            executablePath: ConfigHelper.getConfigValue('chrome_executable_path'),
            headless: ConfigHelper.getConfigValue('headless', false),
            defaultViewport: null,
            args: ['--start-maximized', "--disable-notifications"]
        });

    }

}
