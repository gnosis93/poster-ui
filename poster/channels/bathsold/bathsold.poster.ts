import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';

export class BathsoldPoster extends ChannelBase implements IChannel {

    private readonly channelUrl: string      = 'https://www.bahtsold.com/';
    private readonly postADUrl:string        = 'https://www.bahtsold.com/members/select_ad_category';

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
        private immediatelyPost
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

        // await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await loginPage.goto(this.channelUrl, { waitUntil: 'load' });
        
        let loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
        await loginPage.waitForSelector(loginBTN);
        await loginPage.click(loginBTN);
        await this.delay(500);
        
        await loginPage.type('#login-username', username);
        await loginPage.type('#login-password', password);
        await loginPage.click('.btn.btn-md.btn-blue.block-element');
        // await loginPage.waitForNavigation();

        return loginPage;
    }

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        let browser = await this.lunchBrowser();
        let loginPage = await this.login(browser);
        await this.postAD(loginPage, onPageUploadedCallback);

        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            // await browser.close();
        }

        return true;
    }

    private async postAD(page: puppeteer.Page, onPageUploadedCallback: Function | null = null){
        await page.goto(this.postADUrl,{waitUntil:'load'});
        
        let selectRealEstateCategorySelector = 'li[data-price-30="490"]';
        await page.waitForSelector(selectRealEstateCategorySelector);
        await page.click(selectRealEstateCategorySelector);
        
        let selectCondosCategorySelector = 'li[data-id="175"]';
        await page.waitForSelector(selectCondosCategorySelector);
        await page.click(selectCondosCategorySelector);

        await this.delay(500);
        await page.click('button.submit-category');

        //select free ad option/btn
        let selectFreeAdSelector = 'div[data-type="0"]>div.price-table-footer>a.btn-chosen';
        await page.waitForSelector(selectFreeAdSelector);
        await page.click(selectCondosCategorySelector); 


        // data-id="1"
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
