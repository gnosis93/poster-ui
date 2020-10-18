import * as puppeteer from 'puppeteer';
import { Func } from 'mocha';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { config } from 'process';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';
import { FacebookBase } from './facebook.base';

export class FacebookPagePoster extends FacebookBase implements IChannel {
 
    constructor(private postPages: string[],  credentials: { username: string, password: string }, private imagesToPost: PostImage[], private content: string) {
        super(credentials);
        if (!postPages || postPages.length === 0) {
            throw "Invalid Post pages given to FacebookPagePoster";
        }
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookPagePoster";
        }
    }

    public getImagesToPost() {
        return this.imagesToPost.filter((i) => i.selected == true).map((i) => i.imageURL);
    }

   

    public getPostPages(): Array<string> {//override
        return this.postPages;
    }

  

    public async run(onPageUploadedCallback: Function | null = null): Promise<boolean> {
        this.timeout = await ConfigHelper.getConfigValue<number>('navigation_timeout', this.timeout);

        this.browser    = await this.lunchBrowser();
        let loginPage   = await this.login(this.browser);
        let postedPages = await this.postToPages(this.browser, onPageUploadedCallback);
        await ScreenshootHelper.takeSuccessScreenShot('FB-PAGE-POST', this.Browser);
        if ((ConfigHelper.getConfigValue('headless', false)) === true || ConfigHelper.getConfigValue('close_browser')) {
            await this.browser.close();
        }
        return true;
    }

    private async postToPages(browser: puppeteer.Browser, onPageUploadedCallback: Function | null = null): Promise<puppeteer.Page[]> {
        let pages: puppeteer.Page[] = [];
        let count = 0;
        for (let group of this.getPostPages()) {
            count++;

            const groupPage = await browser.newPage();
            await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            await groupPage.goto(group, { waitUntil: 'networkidle2', timeout: this.timeout });
            // await groupPage.click('div[aria-label="Create Post"]');

            // await this.delay(2000);

            const inputUploadHandles = await groupPage.$$('input[type=file]');

            const inputUploadHandle = inputUploadHandles[1];
            let filesToUpload = this.getImagesToPost();


            // Sets the value of the file input to fileToUpload
            // for(let fileToUpload of filesToUpload){
            // }
            await inputUploadHandle.uploadFile(...filesToUpload);
            await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');

            await groupPage.click('.rq0escxv.datstx6m.k4urcfbm.a8c37x1j');
            await this.delay(100);

            await groupPage.keyboard.type(this.content);   // click submit

            //click the post button
            let postButtonXPath = "//div[text()='Post']"
            //wait for click button to become avaiable
            let postButton = null;

            while (true) {
                postButton = await groupPage.$x(postButtonXPath);
                let disabledJSHandle = await postButton[0].getProperty('attributes');
                let disabledValue = await disabledJSHandle.jsonValue();//when the disabled attribute is not present only 3 values are present
                // postButton[0].
                // console.log(disabledValue);
                if (
                    postButton.length !== 0 &&
                    typeof disabledValue['3'] === 'undefined'
                ) {
                    break;
                }
                await this.delay(100);
            }
            await postButton[0].click()

            if (onPageUploadedCallback !== null) {
                onPageUploadedCallback(groupPage, count);
            }

            pages.push(groupPage);
        }
        return pages;
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
