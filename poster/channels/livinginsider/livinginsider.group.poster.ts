import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class LivinginsiderPoster extends ChannelBase implements IChannel {
    private readonly channelUrl: string = 'https://livinginsider.com/en';
    private readonly channelCreatePostUrl: string = 'https://www.livinginsider.com/living_buysell.php';
    private readonly channelLogoutUrl: string = 'https://www.livinginsider.com/logout.php';
    private readonly chromeSessionPath = 'LivinginsiderSession';//this will not work on windows , will work fine on UNIX like OSes

    constructor(
        private credentials: { username: string, password: string },
        private imagesToPost: PostImage[],
        private thaiContent: string,
        private englishContent: string,
        private title: string,
        private location: string,
        private price: string,
        private surfaceArea: string,
        private phoneNumber: string,
        private phoneExtension: string,
        private immediatelyPost
    ) {
        super();

        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to LivinginsiderGroupPoster";
        }
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
        await loginPage.goto(this.channelUrl, { waitUntil: 'load', timeout: 0 });
        
        let loggedInUserSelector = 'ul.dropdown-menu.dropdown-menu-right.user-link>li.dropdown>a.dropdown-toggle';
        await this.delay(1000);

        try{

            if(loginPage.waitForSelector(loggedInUserSelector, {timeout: 5000}) != null){
                await loginPage.goto(this.channelLogoutUrl, { waitUntil: 'load', timeout: 0 }),
                await loginPage.goto(this.channelUrl, { waitUntil: 'load', timeout: 0 })
            }

        }catch(e){
            console.log('Exception raised, user is not logged in')
        }

        let closeAdModalSelector = '.modal-dialog>.modal-content>.modal-body>a.hideBanner[data-dismiss="modal"][onclick="ActiveBanner.closeActiveBanner();"]';
        await this.delay(1000)
        
        try{
            await Promise.all([
                loginPage.waitForSelector(closeAdModalSelector),
                await loginPage.click(closeAdModalSelector),
                this.delay(500)
            ]);
        }catch(e){
            console.log('Exception raised, no ad modal popup to close found')
        }
            
        let openLoginSelector = 'li#none_login_zone>a[data-target="#loginModal"]';
        await Promise.all([
            loginPage.waitForSelector(openLoginSelector),
            await loginPage.click(openLoginSelector),
            this.delay(500)
        ]);

        let loginUsernameSelector = '#login_username';
        await loginPage.waitForSelector('#login_username');

        await loginPage.type(loginUsernameSelector, username);
        await loginPage.type('#password', password);
        await loginPage.click('#btn-signin');
        await loginPage.waitForNavigation();
        return loginPage;
    }
    
    private async closePage(browser, page) {
        if (page.browserContextId != undefined) {
          await browser._connection.send('Target.disposeBrowserContext', {browserContextId: page.browserContextId});
        }
        await page.close();
    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        let browser = await this.lunchBrowser();
        let loginPage = await this.login(browser);
        await this.postToPages(loginPage, onPageUploadedCallback);

        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            // await browser.close();
        }

        return true;
    }

    private async postToPages(page: puppeteer.Page, onPageUploadedCallback: Function | null = null): Promise<puppeteer.Page> {
        let count = 0;

        await page.setDefaultNavigationTimeout(10000);

        //navigate to create post page
        await page.goto(this.channelCreatePostUrl, { waitUntil: 'load', timeout: 0 });

        //close privacy modal if visible
        let closePrivacyModalSelector = 'div.col-md-1.col-sm-1.accetpPrivacy>a[href="javascript:void(0)"]';
        await this.delay(1000)
        
        try{
            await Promise.all([
                page.waitForSelector(closePrivacyModalSelector),
                await page.click(closePrivacyModalSelector),
                this.delay(1000)
            ]);
        }catch(e){
            console.log('Exception raised, privacy modal is not visible')
        }

        /** 
         * CREATE POST - STEP ONE
         * TITLE
        */

        //select Agent as status
        await page.click('#web_post_from2');
        await this.delay(1000);

        //select Condo as property type
        await page.waitForSelector('#select2-buildingList-container');
        await page.click('#select2-buildingList-container');
        await page.waitForSelector('li.select2-results__option.select2-results__option--highlighted');
        await page.click('li.select2-results__option.select2-results__option--highlighted');

        //select For Sale as post type
        await page.click('#web_post_type1');

        //enter project name (Unknown project)
        await page.click('#select2-web_project_id-container');
        await page.waitForSelector('.select2-search__field');
        await page.type('.select2-search__field', 'Unknown project');
        await page.waitForSelector('li.select2-results__option.select2-results__option--highlighted');
        await page.click('li.select2-results__option.select2-results__option--highlighted');
        await this.delay(4000);
        //enter zone name (Pattaya)
        await page.waitForSelector('#select2-web_zone_id-container');
        await page.click('#select2-web_zone_id-container');
        await page.waitForSelector('.select2-search__field');
        await page.type('.select2-search__field', 'Pattaya');
        await page.waitForSelector('li.select2-results__option.select2-results__option--highlighted');
        await page.click('li.select2-results__option.select2-results__option--highlighted');

        //enter title (TH)
        await page.click('#web_title');
        await page.type('#web_title', this.title);

        //enter description (TH)
        await page.click('#web_description');
        await page.type('#web_description', this.englishContent); //TODO: need to use thai in the future

        //enter title (EN)
        let englishLanguageSelector = 'div.col-md-12.col-sm-12.title-des-lang>ul.nav.nav-tabs>li>a[href="#en"]';
        await page.click(englishLanguageSelector);
        await this.delay(1000);

        await page.click('#web_title_en');
        await page.type('#web_title_en', this.title);

        //enter description (EN)
        await page.click('#web_description_en');
        await page.type('#web_description_en', this.englishContent);
        await this.delay(1000);

        //click on next step
        await page.waitForSelector('button[type=submit]');
        await page.click('button[type=submit]');

        /** 
         * CREATE POST - STEP 2
         * DETAIL
        */

        // await this.clickTickboxByIndex(page, 3);
        // await page.waitForSelector('button[type=submit]');
        // await page.click('button[type=submit]');
        // await page.waitForSelector('.option-label');
        // await this.clickTickboxByIndex(page, 3, '.option-label');
        // await page.waitForSelector('button[type=submit]');
        // await page.click('button[type=submit]');
        // await page.waitForSelector("#PostingTitle");
        // await this.threeClickType(page,"#PostingTitle",this.title);
        // await this.threeClickType(page,"#geographic_area",this.location);
        // await this.threeClickType(page,"input[name='price']",this.price);

        // await this.threeClickType(page, "input[name='surface_area']", this.surfaceArea);

        // let fromEmailFieldExists = await page.$("input[name=FromEMail][type=text]");
        // if(fromEmailFieldExists !== null){
        //     await this.threeClickType(page, "input[name=FromEMail][type=text]", this.credentials.username);
        // }

        // let housingTypeSelectorExists = await page.$("select[name='housing_type']") !== null ? true: false;
        // if(housingTypeSelectorExists === true){
        //     await page.select("select[name='housing_type']", '2');
        // }
        // await page.click('input.show_phone_ok');
        // await page.type("input[name='contact_phone']", this.phoneNumber);
        // await page.type("input[name='contact_phone_extension']", this.phoneExtension);
        // let isFurnishedSelectorExists = await page.$("input.is_furnished") !== null ? true: false;
        // if(isFurnishedSelectorExists){
        //     await page.click('input.is_furnished');
        // }
    
        // await Promise.all([
        //     page.waitForNavigation({ waitUntil: 'load' }),
        //     await page.click('button[type=submit]'),
        // ]);
      
        // console.log('wating for imgcount');
        // await page.waitForSelector('.imgcount')
        // console.log('READY WITH: wating for imgcount');
        
        // await page.waitForSelector('input[type=file]');
        // const inputUploadHandles = await page.$$('input[type=file]');
        // const inputUploadHandle  = inputUploadHandles[0];
        // let filesToUpload        = this.getImagesToPost();
        // await inputUploadHandle.uploadFile(...filesToUpload);
        
        // let imageCount = (await this.getImageCount(page));
        // while (imageCount < filesToUpload.length) {
        //     await this.delay(500);
        //     imageCount = (await this.getImageCount(page));
        //     console.log('wating image count')
        // }
        // await page.click('button[type=submit].done');

        // if(this.immediatelyPost){
        //     await page.waitForSelector("button[name='go']");
        //     await page.click("button[name='go']");
        // }

        return page;
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


    
    async lunchBrowser(): Promise<puppeteer.Browser> {//override
        let config = ConfigHelper.getConfig();

        return puppeteer.launch({
            executablePath: ConfigHelper.getConfigValue('chrome_executable_path'),
            headless: ConfigHelper.getConfigValue('headless', false),
            defaultViewport: null,
            args: ['--start-maximized', "--disable-notifications"],
            userDataDir: this.getPathInUserData(this.chromeSessionPath)
        });

    }

}
