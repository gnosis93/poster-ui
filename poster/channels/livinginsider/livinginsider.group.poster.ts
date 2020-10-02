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
        private immediatelyPost,
        private beds:number,
        private baths:number
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

            if(await loginPage.waitForSelector(loggedInUserSelector, {timeout: 5000}) != null){
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
        // await page.waitForSelector('button[type=submit]');
        await Promise.all([
            page.click('button[type=submit]'),
            page.waitForNavigation()
        ]);
        
        /** 
         * CREATE POST - STEP 2
         * DETAIL
        */

        //select bedrooms
        let select2Elements = await page.$$('.select2.select2-container.select2-container');
        await select2Elements[0].click();        
        
        await  page.click('#select2-web_room-results>li:nth-child('+(this.baths + 2)+')')
        

        //select baths
        await select2Elements[1].click();        
        
        await  page.click('#select2-web_bathroom-results>li:nth-child('+(this.baths + 1)+')')
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
