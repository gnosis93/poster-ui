import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class BathsoldPoster extends ChannelBase implements IChannel {

    private readonly channelUrl: string      = 'https://www.bahtsold.com/';
    private readonly postADUrl:string        = 'https://www.bahtsold.com/members/select_ad_category';
    private readonly maxLoginAttempts:number = 10;
    private loginAttemptsCount:number        = 0;
    
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
        private immediatelyPost,
        private numberOfBeds:number,
        private numberOfBaths:number
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
        let loginPage = await this.getActivePage(browser,1200);
        let { username, password } = this.getCredentials();
        await this.delay(500);

        // await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        let loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
        await Promise.all([
            await loginPage.goto(this.channelUrl, { waitUntil: 'load' }),
            loginPage.waitForSelector(loginBTN),
            await loginPage.click(loginBTN),
            
        ]);
        
        await this.delay(500);
        
        let loginUsernameSelector = '#login-username';
        await Promise.all([
            loginPage.waitForSelector(loginUsernameSelector),
            await loginPage.type(loginUsernameSelector, username),

        ]);

        await Promise.all([
            this.delay(200),
            loginPage.type('#login-password', password)
        ]);

        let loginBTNSelector = 'button.btn.btn-md.btn-blue.block-element';

        await Promise.all([
            loginPage.waitForSelector(loginBTNSelector),
            await loginPage.click(loginBTNSelector),
            // this.clickTickboxByIndex(loginPage,0,loginBTNSelector)
        ]);
        
        await loginPage.waitForSelector('.app-logo')

        // let loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
        let loginBTNCount = (await loginPage.$$(loginBTN)).length;
        if(loginBTNCount > 0){
            this.loginAttemptsCount++;
            if(this.loginAttemptsCount > this.maxLoginAttempts){
                console.log('Login Failed, max login attempts reached!!! Count: '+this.loginAttemptsCount);
                return loginPage;
            }else{
                console.log('Login Failed, reattempting login recursively. Count: '+this.loginAttemptsCount);
                return (await this.login(browser));
            }
        }
        return loginPage;
    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        let browser = await this.lunchBrowser();
        await this.delay(500);
        let loginPage = await this.login(browser);
        await this.postAD(loginPage, onPageUploadedCallback);

        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            // await browser.close();
        }

        return true;
    }

    private async postAD(page: puppeteer.Page, onPageUploadedCallback: Function | null = null){
        await page.goto(this.postADUrl,{waitUntil:'networkidle2',timeout:15000});
        
        let selectRealEstateCategorySelector = 'li[data-price-30="490"]';
        await page.waitForSelector(selectRealEstateCategorySelector);
        await page.click(selectRealEstateCategorySelector);
        await this.delay(500);
        
        let selectCondosCategorySelector = 'li[data-id="175"]';
        await page.waitForSelector(selectCondosCategorySelector);
        await page.click(selectCondosCategorySelector);
        await this.delay(500);

        await page.click('button.submit-category');
        await this.delay(500);

        //select free ad option/btn
        let selectFreeAdSelector = 'div[data-type="0"]>div.price-table-footer>a.btn-chosen';
        await page.waitForSelector(selectFreeAdSelector);
        await page.click(selectFreeAdSelector); 
        await this.delay(500);

        //click continue button
        let continueBtnSelector = '.btn.btn-blue.btn-sm.submit-category' ;
        await page.waitForSelector(continueBtnSelector);
        await page.click(continueBtnSelector);
        await this.delay(500);

        //click is agent checkbox
        let isAgentCheckBoxSelector = 'label[for="is_owner_0"]';
        await page.waitForSelector(isAgentCheckBoxSelector);
        await page.click(isAgentCheckBoxSelector);


        await page.type('#ad_title_en',this.title);
        
        //select condo type
        await page.click('div.property_type');
        await this.delay(500);

        let condoPropertyTypeSelector = 'label[for=property_type_2272]';
        await page.waitForSelector(condoPropertyTypeSelector);
        await page.click(condoPropertyTypeSelector);
        await this.delay(500);

        //set number of baths
        await page.click('div.number_of_bath');
        let numberOfBathsSelector = 'label[for="number_of_bath_'+this.numberOfBaths+'"]';
        if(this.numberOfBaths > 19){
            numberOfBathsSelector = 'label[for="number_of_bath_20"]';
        }
        await page.waitForSelector(numberOfBathsSelector);
        await page.click(numberOfBathsSelector);
        await this.delay(500);

        //set number of beds
        await page.click('div.number_of_bed');
        let numberOfBedsSelector = 'label[for="number_of_bed_'+this.numberOfBaths+'"]';
        if(this.numberOfBaths > 19){
            numberOfBedsSelector = 'label[for="number_of_bed_20"]';
        }
        await page.waitForSelector(numberOfBedsSelector);
        await page.click(numberOfBedsSelector);
        await this.delay(500);



        //furnished level
        await page.click('div.furnished');
        let fullyFurnishedOptionSelector = 'label[for="furnished_2280"]';
        await page.waitForSelector(fullyFurnishedOptionSelector);
        await page.click(fullyFurnishedOptionSelector);
        await this.delay(500);

        //property size
        await page.type('#property_size',this.surfaceArea)
        await page.type('#land_size',this.surfaceArea)


        await page.type('input[name="data[ad_price]"]',this.price);
        await page.type('textarea#ad_desc_en',this.content);

        //upload images
        
        let imageInputSelector = 'input[name="files[]"]';
        await page.waitForSelector(imageInputSelector);
        const inputUploadHandles = await page.$$(imageInputSelector);
        const inputUploadHandle  = inputUploadHandles[0];
        let filesToUpload        = this.getImagesToPost();

        //remove any images that are already selected
        let removeImageBtns = await page.$$('.fileuploader-action-remove');        
        for(let removeImageBtn of removeImageBtns){
            await page.keyboard.press('Enter');//enter to confirm yes in confirm dialog popup
            await removeImageBtn.click();
        }

        //we can only upload up to 6 files, therefore if we have more we need to remove the extra ones
        if(filesToUpload.length > 6){
            let filesToUploadLimited = [];
            let count = 1;
            for(let file of filesToUpload){
                if(count > 6){
                    break;
                }
                filesToUploadLimited.push(file);
                count++;
            }
            filesToUpload = filesToUploadLimited;
        }

        await inputUploadHandle.uploadFile(...filesToUpload);
        //select property location
        await page.click('div.select_area');
        await page.click('label[for="area_1006"]');

        let provinceSelector = 'label[for="province_11"]';
        await page.click('#select_province_val');
        await this.delay(500);
        await page.waitForSelector(provinceSelector);
        await page.click(provinceSelector);
        await this.delay(500);

        await page.click('#select_city_val');
        await this.delay(500);

        let pattayaCentralOption = 'label[for="city_1075"]';
        await page.waitForSelector(pattayaCentralOption);
        await page.click(pattayaCentralOption);
        await this.delay(500);
        
        let submitButtonSelector = '#placecomplete';
        await page.waitForSelector(submitButtonSelector);
        await page.click(submitButtonSelector);
        
        // for(let file of filesToUpload){
        // }
        
    }

    async lunchBrowser(): Promise<puppeteer.Browser> {//override
        return puppeteer.launch({
            executablePath: ConfigHelper.getConfigValue('chrome_executable_path'),
            headless: ConfigHelper.getConfigValue('headless', false),
            defaultViewport: null,
            args: ['--start-maximized', "--disable-notifications"]
        });
    }

}
