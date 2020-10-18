import { ChannelBase } from "../channel.base";
import { IChannel } from "../channel.interface";
import * as puppeteer from 'puppeteer';

export abstract class FacebookBase extends ChannelBase  {
    protected readonly channelUrl: string = 'https://facebook.com/';
    protected readonly channelLoginUrl: string = 'https://en-gb.facebook.com/login/';
    
    private credentials:{ username: string, password: string };

    constructor(credentials:{ username: string, password: string }){
        super();
        this.credentials = credentials;
    }

    public getCredentials() {//override
        return this.credentials;
    }

    protected async closeAcceptCookiesModal(loginPage: puppeteer.Page) {
        let btnAcceptAllSelector = 'button[title="Accept All"]';
        try {
            await loginPage.waitForSelector(btnAcceptAllSelector, { timeout: this.timeout / 2 });
        } catch (e) {
            console.log('no "accept cookies" modal found')
            return false;
        }

        loginPage.click(btnAcceptAllSelector);
        return true;
    }

    protected async closeAcceptTermsModal(loginPage: puppeteer.Page) {
        //accept terms if required
        try {
            let btnAcceptTerms = 'button[data-testid="cookie-policy-banner-accept"]';
            await loginPage.waitForSelector(btnAcceptTerms, { timeout: this.timeout });
            await loginPage.click(btnAcceptTerms);
        } catch (e) {
            console.log('No accept terms key found');
        }
    }

    protected async login(browser: puppeteer.Browser): Promise<puppeteer.Page> {
        // let loginPage =  await browser.newPage();
        let loginPage = await this.getActivePage(browser, 100);
        let { username, password } = this.getCredentials();


        await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await loginPage.goto(this.channelLoginUrl, { waitUntil: 'load' });


        //accept terms if required
        await this.closeAcceptCookiesModal(loginPage);
        await this.closeAcceptTermsModal(loginPage);

        await loginPage.type('#email', username);
        await loginPage.type('#pass', password);

        await this.delay(500);

        // let loginBtn = '._xkt'//'#loginbutton';

        await loginPage.focus('#pass');
        await loginPage.keyboard.press('Enter');
        await loginPage.waitForNavigation({timeout:this.timeout});


        return loginPage;
    }
}
