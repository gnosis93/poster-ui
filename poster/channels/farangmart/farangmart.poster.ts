import * as puppeteer from 'puppeteer';
import { ChannelBase } from '../channel.base';
import { IChannel } from '../channel.interface';
import { ConfigHelper } from '../../helpers/config.helper';
import { PostImage } from '../../models/post.interface';
import { ScreenshootHelper } from '../../helpers/screenshot.helper';

export class FarangmartPoster extends ChannelBase implements IChannel {

    private readonly channelUrl: string = 'https://farangmart.co.th/';
    private readonly postADUrl: string = 'https://farangmart.co.th/login/?redirect_to=https%3A%2F%2Ffarangmart.co.th%2Fcreate-listing%2F';
    private readonly maxLoginAttempts: number = 10;
    private loginAttemptsCount: number = 0;

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

       //TODO: complete login

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
        await page.goto(this.postADUrl, { waitUntil: 'networkidle2', timeout: this.timeout });

        //TODO: complete postAD
    }



}
