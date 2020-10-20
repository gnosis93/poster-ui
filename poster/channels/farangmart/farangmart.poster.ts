import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';

export class FarangmartPoster extends ChannelBase implements IChannel {

    private readonly channelUrl: string = 'https://farangmart.co.th/';
    private readonly loginUrl: string = 'https://farangmart.co.th/login';
    private readonly postADUrl: string = 'https://farangmart.co.th/create-listing/';
    private readonly maxLoginAttempts: number = 10;
    private loginAttemptsCount: number = 0;
    private forSale = true;

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
            throw "Invalid Credentials Object given to CraigslistGroupPoster";
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
        await this.delay(500);

        await loginPage.goto(this.loginUrl, { waitUntil: 'load', timeout: this.timeout });
        await loginPage.waitForSelector('.shadowblock #login_username');
        await loginPage.click('.shadowblock #login_username');
        await loginPage.type('.shadowblock #login_username', username);

        await loginPage.waitForSelector('.shadowblock #login_password');
        await loginPage.click('.shadowblock #login_password');
        await loginPage.type('.shadowblock #login_password', password);

        await loginPage.waitForSelector('.left-box > #login-form > #checksave #login');
        await loginPage.click('.left-box > #login-form > #checksave #login');

        return loginPage;
    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        this.timeout = await ConfigHelper.getConfigValue<number>('navigation_timeout', this.timeout);
        let browser = await this.lunchBrowser();
        let loginPage = await this.login(browser);
        await this.postAD(loginPage, onPageUploadedCallback);
        await ScreenshootHelper.takeSuccessScreenShot('farangmart_' + this.title, this.Browser);

        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            await browser.close();
        }

        return true;
    }

    private async postAD(page: puppeteer.Page, onPageUploadedCallback: Function | null = null) {
        await page.goto(this.postADUrl, { waitUntil: 'load', timeout: this.timeout });
        
        //select category
        await page.waitForSelector('.form-fields #ad-categories #ad_cat_id')
        await page.click('.form-fields #ad-categories #ad_cat_id')
        await this.delay(500)
        
        await page.select('.form-fields #ad-categories #ad_cat_id', '1151')
        
        await page.waitForSelector('.form-fields #ad-categories #ad_cat_id')
        await page.click('.form-fields #ad-categories #ad_cat_id')
        await this.delay(2000)

        await page.waitForSelector('.form-fields #catlvl1 > #ad_cat_id')
        await page.click('.form-fields #catlvl1 > #ad_cat_id')
        await this.delay(500)
        
        if(this.price && this.price != ""){
            console.log('condo for sale')
            await page.select('.form-fields #catlvl1 > #ad_cat_id', '1245')
        }else{
            this.forSale = false;
            console.log('condo for rent')
            await page.select('.form-fields #catlvl1 > #ad_cat_id', '1247')
        }
        
        await page.waitForSelector('.form-fields #catlvl1 > #ad_cat_id')
        await page.click('.form-fields #catlvl1 > #ad_cat_id')
        await this.delay(3000)
        
        await page.waitForSelector('#mainform #getcat')
        await page.click('#mainform #getcat')
        await this.delay(5000)
        
        //details
        await page.waitForSelector('#mainform #post_title')
        await page.click('#mainform #post_title')
        await page.type('#mainform #post_title', this.title);
        
        await page.waitForSelector('#mainform #cp_price')
        await page.click('#mainform #cp_price')
        await page.type('#mainform #cp_price', this.price);

        //different selector names for phone on sale/rent
        if(this.forSale){
            await page.waitForSelector('#mainform #cp_id_556')
            await page.click('#mainform #cp_id_556')
            await page.type('#mainform #cp_id_556', this.phoneExtension + this.phoneNumber);
        }else{
            await page.waitForSelector('#mainform #cp_phone')
            await page.click('#mainform #cp_phone')
            await page.type('#mainform #cp_phone', this.phoneExtension + this.phoneNumber);
        }
        
        await page.waitForSelector('ol > .form-fields > #list_cp_private_seller > .selectBox > .selectBox-label')
        await page.click('ol > .form-fields > #list_cp_private_seller > .selectBox > .selectBox-label')
        await this.delay(500)
        await page.click('.page-template > .selectBox-dropdown-menu > li:nth-child(3) > a')
        
        await page.waitForSelector('#mainform #cp_unit_size')
        await page.click('#mainform #cp_unit_size')
        await page.type('#mainform #cp_unit_size', this.surfaceArea);
        
        if(this.forSale){
            //ownership
            await page.waitForSelector('.form-fields > #list_cp_ownership li:nth-child(4) > #cp_ownership')
            await page.click('.form-fields > #list_cp_ownership li:nth-child(4) > #cp_ownership')
        }else{
            //rental term
            await page.waitForSelector('.form-fields > #list_cp_rental_term #cp_rental_term_9')
            await page.click('.form-fields > #list_cp_rental_term #cp_rental_term_9')
        }

        if(!this.numberOfBeds || this.numberOfBeds < 1){
            this.numberOfBeds = 1;
        }
        await page.waitForSelector('ol > .form-fields > #list_cp_bedrooms > .selectBox > .selectBox-label')
        await page.click('ol > .form-fields > #list_cp_bedrooms > .selectBox > .selectBox-label')
        await this.delay(500)
        await page.click('.page-template > .selectBox-dropdown-menu > li:nth-child('+(this.numberOfBeds + 2)+') > a')
        
        await page.waitForSelector('ol > .form-fields > #list_cp_furnishings > .selectBox > .selectBox-label')
        await page.click('ol > .form-fields > #list_cp_furnishings > .selectBox > .selectBox-label')
        await this.delay(500)
        await page.click('.page-template > .selectBox-dropdown-menu > li:nth-child(8) > a')
        
        await page.waitForSelector('#mainform #post_content')
        await page.click('#mainform #post_content')
        await page.type('#mainform #post_content', this.content);

        await page.waitForSelector('ol > .form-fields > #list_cp_state > .selectBox > .selectBox-label')
        await page.click('ol > .form-fields > #list_cp_state > .selectBox > .selectBox-label')
        await this.delay(500)
        await page.click('.page-template > .selectBox-dropdown-menu > li:nth-child(2) > a')
        
        await page.waitForSelector('#mainform #cp_zipcode')
        await page.click('#mainform #cp_zipcode')
        await page.type('#mainform #cp_zipcode', 'Pattaya');

        //image upload (2x5)
        let images        = this.getImagesToPost();
        let filesToUpload1 = images.length > 5 ? images.slice(0, 5) : images;
        let filesToUpload2 = images.length > 5 ? images.slice(5, 5) : null;
        await page.waitForSelector('.form-fields #app-attachment-upload-pickfiles')
        await page.click('.form-fields #app-attachment-upload-pickfiles')
        let imagesInputSelector = 'input[type=file][multiple]';
        const inputUploadHandles = await page.$$(imagesInputSelector);
        const inputUploadHandle  = inputUploadHandles[0];
        for(let file of filesToUpload1){
            await inputUploadHandle.uploadFile(file)
            await this.delay(500)
        }
        if(filesToUpload2 != null){
            await this.delay(1000)
            await page.waitForSelector('.form-fields #app-attachment-upload-pickfiles')
            await page.click('.form-fields #app-attachment-upload-pickfiles')
            imagesInputSelector = 'input[type=file][multiple]';
            for(let file of filesToUpload2){
                await inputUploadHandle.uploadFile(file)
                await this.delay(500)
            }
        }

        //preview
        // await page.waitForSelector('#step1 > #mainform #step1')
        // await page.click('#step1 > #mainform #step1')
        // await this.delay(5000)

        //options/pay (finish submitting)
        // await page.waitForSelector('#step2 > #mainform #step2')
        // await page.click('#step2 > #mainform #step2')
  
        //return page;
    }
}