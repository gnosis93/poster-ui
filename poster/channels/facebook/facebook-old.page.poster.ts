import * as puppeteer from 'puppeteer';
import { Func } from 'mocha';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { config } from 'process';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';
import { FacebookBase } from './facebook.base';

export class FacebookOldPagePoster extends FacebookBase implements IChannel {

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

        await ScreenshootHelper.takeSuccessScreenShot('FB-OLD-PAGE-POST', this.Browser);
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

            await groupPage.goto(group, { waitUntil: 'networkidle2' });

            await groupPage.click('textarea[title="Write a post..."]');
            await this.delay(100);

            await groupPage.keyboard.type(this.content);   // click submit

            //click the post button
            let postButtonXPath = "//span[text()='Post']"
            //wait for click button to become avaiable.
            const fileInputSelector = 'input[type=file]';
            const inputUploadHandles = await groupPage.$$(fileInputSelector);
            if( inputUploadHandles.length == 0){
                throw('Unable to find image upload input selector: '+fileInputSelector)
            }
            const inputUploadHandle = inputUploadHandles[0];
            let filesToUpload = this.getImagesToPost();

            for (let image of filesToUpload) {
                await inputUploadHandle.uploadFile(image);
                await this.delay(1000);
            }

            await this.delay(2000);

            let postButton = await groupPage.click('button[type="submit"][value="1"]._1mf7');

            // while(true){
            //     let disabledJSHandle = await postButton[0].getProperty('attributes');
            //     let disabledValue = await disabledJSHandle.jsonValue();//when the disabled attribute is not present only 3 values are present
            //     // postButton[0].
            //     // console.log(disabledValue);
            //     if(
            //         postButton.length !== 0 &&
            //         typeof disabledValue['3'] === 'undefined'
            //     ){
            //         break;
            //     }
            //     await this.delay(100);
            // }
            // await postButton[0].click()

            if (onPageUploadedCallback !== null) {
                onPageUploadedCallback(groupPage, count);
            }

            pages.push(groupPage);
        }
        return pages;
    }

}
