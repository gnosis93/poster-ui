import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';
import { throws } from 'assert';

export class Listproperty4freePoster extends ChannelBase implements IChannel {

    private readonly channelUrl: string = 'https://www.listproperty4free.com/';
    private readonly loginUrl: string = 'https://www.listproperty4free.com/login.php';
    private readonly postADUrl: string = 'https://www.listproperty4free.com/add_property.php';
    private readonly maxLoginAttempts: number = 10;
    private loginAttemptsCount: number = 0;
    private forSale = true;
    private priceInEuro: string = "";

    constructor(
        private credentials: { username: string, password: string },
        private imagesToPost: PostImage[],
        private content: string,
        private title: string,
        private location: string,
        private price: string,
        private rentalPrice: string,
        private surfaceArea: string,
        private phoneNumber: string,
        private phoneExtension: string,
        private immediatelyPost,
        private numberOfBeds: number,
        private numberOfBaths: number
    ) {
        super();

        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to Listproperty4freePoster";
        }
    }

    public getImagesToPost() {
        return this.imagesToPost.filter((i) => i.selected == true).map((i) => i.imageURL);
    }

    public getCredentials() {//override
        return this.credentials;
    }

    private async login(browser: puppeteer.Browser): Promise<puppeteer.Page> {
        let loginPage = await this.getActivePage(browser, this.timeout);
        let { username, password } = this.getCredentials();

        await loginPage.goto(this.loginUrl, { waitUntil: 'load', timeout: this.timeout });

        let closeAdModalSelector = 'body > .cc-window > .cc-compliance > .cc-dismiss';        
        try{
            this.delay(3000)
            loginPage.waitForSelector(closeAdModalSelector,{timeout: this.timeout });
            let items = await loginPage.$$(closeAdModalSelector);
            await items[0].click();
            this.delay(1000)
        }catch(e){
            console.log('Exception raised, no ad modal popup to close found')
        }

        await loginPage.waitForSelector('input[name="user_name"]')
        await loginPage.click('input[name="user_name"]')
        await loginPage.type('input[name="user_name"]', username);
        await this.delay(500);
        
        await loginPage.waitForSelector('input[name="user_password"]')
        await loginPage.click('input[name="user_password"]')
        await loginPage.type('input[name="user_password"]', password);
        await this.delay(500);
        
        await loginPage.waitForSelector('.columns > .button-list > li:nth-child(1) > button > .icon')
        await loginPage.click('.columns > .button-list > li:nth-child(1) > button > .icon')

        return loginPage;
    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        this.timeout = await ConfigHelper.getConfigValue<number>('navigation_timeout', this.timeout);
        let browser = await this.lunchBrowser();
        let loginPage = await this.login(browser);
        await this.postAD(loginPage, onPageUploadedCallback);
        await ScreenshootHelper.takeSuccessScreenShot('listproperty4free_' + this.title, this.Browser);

        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            await browser.close();
        }

        return true;
    }

    private async postAD(page: puppeteer.Page, onPageUploadedCallback: Function | null = null) {
        await page.goto(this.postADUrl, { waitUntil: 'load', timeout: this.timeout });

        //Step 1: Description
        if(this.price && this.price != ""){
            console.log('condo for sale')
            await page.waitForSelector('.tabs-content > #panel1 #ad_type_choice1')
            await page.click('.tabs-content > #panel1 #ad_type_choice1')
            this.priceInEuro = Math.round(Number(this.price) * 0.0269756).toString();
        }else{
            this.forSale = false;
            console.log('condo for rent')
            await page.waitForSelector('.tabs-content > #panel1 #ad_type_choice2')
            await page.click('.tabs-content > #panel1 #ad_type_choice2')
            this.priceInEuro = Math.round(Number(this.rentalPrice) * 0.0269756).toString();
        }

        await page.waitForSelector('#panel1 #pty_name')
        await page.click('#panel1 #pty_name')
        await page.type('#panel1 #pty_name', this.title);
        
        await page.waitForSelector('#panel1 #pty_type')
        await page.click('#panel1 #pty_type')
        await page.select('#panel1 #pty_type', 'apartment block')

        await page.waitForSelector('#panel1 #pty_price')
        await page.click('#panel1 #pty_price')
        await page.type('#panel1 #pty_price', this.priceInEuro);
        
        await page.waitForSelector('#panel1 #pty_details')
        await page.click('#panel1 #pty_details')
        await page.type('#panel1 #pty_details', this.content);

        await page.waitForSelector('.tabs-content > #panel1 > .row > .column > .button')
        await page.click('.tabs-content > #panel1 > .row > .column > .button')
        await this.delay(1000)

        //Step 2: Details
        await page.waitForSelector('.column #pty_country')
        await page.click('.column #pty_country')
        await page.select('.column #pty_country', 'TH')
        await this.delay(500)
        
        await page.waitForSelector('.column #pty_region_sel')
        await page.click('.column #pty_region_sel')
        await page.select('.column #pty_region_sel', 'Chon Buri')
        
        await page.waitForSelector('.column #pty_location')
        await page.click('.column #pty_location')
        await page.type('.column #pty_location', 'Pattaya');

        await page.waitForSelector('.column > #div_what > #div_pty_type2 #pty_type2')
        await page.click('.column > #div_what > #div_pty_type2 #pty_type2')
        await page.select('.column > #div_what > #div_pty_type2 #pty_type2', 'apartment block')
        await this.delay(500)
        
        await page.waitForSelector('.column > #div_what > #div_pty_sub_type #pty_sub_type')
        await page.click('.column > #div_what > #div_pty_sub_type #pty_sub_type')
        await page.select('.column > #div_what > #div_pty_sub_type #pty_sub_type', '8')

        await page.waitForSelector('.column > #div_what > #div_pty_bathroom #pty_bathroom')
        await page.click('.column > #div_what > #div_pty_bathroom #pty_bathroom')
        await page.type('.column > #div_what > #div_pty_bathroom #pty_bathroom', (this.numberOfBaths > 0 ? this.numberOfBaths.toString() : '1'));
        
        await page.waitForSelector('.column > #div_what > #div_pty_area #pty_area')
        await page.click('.column > #div_what > #div_pty_area #pty_area')
        await page.type('.column > #div_what > #div_pty_area #pty_area', this.surfaceArea);

        await page.waitForSelector('.row #pty_structure2')
        await page.click('.row #pty_structure2')

        //setting extras
        if(this.content.indexOf('Car Parking') > -1){
            await page.waitForSelector('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(3) > input')
            await page.click('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(3) > input')
        }
        if(this.content.indexOf('Swimming pool') > -1){
            await page.waitForSelector('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(4) > input')
            await page.click('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(4) > input')
        }
        if(this.content.indexOf('Garden') > -1){
            await page.waitForSelector('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(5) > input')
            await page.click('#pty_extra_div_main > div:nth-of-type(2) > #pty_extra_div > div:nth-of-type(5) > input')
        }

        await page.waitForSelector('.tabs-content > #panel2 > .row > .column > .float-right')
        await page.click('.tabs-content > #panel2 > .row > .column > .float-right')
        await this.delay(1000)

        //Step 3: Images
        let images = this.getImagesToPost();
        let imageInputSelector = 'input[type="file"][multiple="multiple"]';
        await page.waitForSelector(imageInputSelector, { timeout: this.timeout });
        const inputUploadHandles = await page.$$(imageInputSelector);
        const inputUploadHandle  = inputUploadHandles[0];
        await inputUploadHandle.uploadFile(...images);

        let imageCount = (await this.getImageCount(page));
        while (imageCount < images.length) {
            await this.delay(500);
            imageCount = (await this.getImageCount(page));
            console.log('waiting image count')
        }

        await page.waitForSelector('.tabs-content > #panel3 > .row > .column > .float-right')
        await page.click('.tabs-content > #panel3 > .row > .column > .float-right')
        await this.delay(1000)

        //Step 4: Location
        await page.waitForSelector('#panel4 #pty_address')
        await page.click('#panel4 #pty_address')
        await page.type('.column #pty_location', 'Pattaya');
        await this.delay(500)
        
        await page.waitForSelector('#panel4 > .row > .columns > .button > span')
        await page.click('#panel4 > .row > .columns > .button > span')
        await this.delay(2000)
        
        await page.waitForSelector('.tabs-content > #panel4 > .row > .column > .float-right')
        await page.click('.tabs-content > #panel4 > .row > .column > .float-right')
        await this.delay(1000)

        //Step 5: Publish
        await page.waitForSelector('.tabs-content > #panel5 > .row > .column > .float-right')
        await page.click('.tabs-content > #panel5 > .row > .column > .float-right')
        await this.delay(1000);
  
        return page;
    }

    private async getImageCount(page: puppeteer.Page) {
        let elements = await page.$$('.row > .columns > #myDropzone > .dz-success > .dz-success-mark')
        return elements.length;
    }
}
