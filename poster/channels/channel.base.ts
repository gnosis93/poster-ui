import * as puppeteer from 'puppeteer';
import * as path from 'path';
import { ConfigHelper } from '../helpers/config.helper';
const {app} = require('electron');

export abstract class ChannelBase {

    protected browser:puppeteer.Browser|null;
    
    async lunchBrowser(): Promise<puppeteer.Browser> {//override
        try {
            this.browser = await puppeteer.launch({
                executablePath: ConfigHelper.getConfigValue('chrome_executable_path'),
                headless: ConfigHelper.getConfigValue('headless', false),
                defaultViewport: null,
                args: ['--start-maximized', "--disable-notifications"]
            });
            return this.browser;
        } catch (e) {
            console.log('Failed to lunch browser, exception message: ' + e.toString());
            if (this.browser) {
                await this.browser.close()
            }
            return await this.lunchBrowser();
        }
    }

    public async kill(){
        if(this.browser){
            try{
                await this.browser.close();
                return true;
            }catch(e){console.log('Failed to kill channel posting process, exception '+e.toString())}
        }
        return false;
    }

    protected async threeClickType(page: puppeteer.Page, selector: string, value: string) {
        const input = await page.$(selector);
        if(input === null){
            throw 'ThreeClickType Exception: unable to find specfied selector: '+selector
        }
        await input.click({ clickCount: 3 });//selects all text in input thus causing it to be deleted
        await input.type(value);
    }

    protected getPathInUserData(pathToFile:string){
        return path.join( app.getPath('userData'),pathToFile)
    }

    protected getPostsDir(additonalPath:string|null=null):string{
        if(additonalPath == null){
            return path.join( app.getPath('userData'),'posts')
        }else{
            return path.join( app.getPath('userData'),'posts',additonalPath)
        }
    }
    /**
     * Helper function to delay the process , used to await loading of elements/html 
     * @param time time in miliseconds 
     */
    protected async delay(time:number) : Promise<void>{//inherited
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }


    protected async getActivePage(browser:puppeteer.Browser, timeout:number) :Promise<puppeteer.Page>{
        var start = new Date().getTime();
        while(new Date().getTime() - start < timeout) {
            var pages = await browser.pages();
            var arr = [];
            for (const p of pages) {
                if(await p.evaluate(() => { return document.visibilityState == 'visible' })) {
                    arr.push(p);
                }
            }
            if(arr.length == 1) return arr[0];
        }
        throw "Unable to get active page";
    }

    protected async clickTickboxByIndex(page: puppeteer.Page, selectionIndex: number, querySelector = ".selection-list>li>label>.right-side", awaitNavigation: boolean = true) {
        // const linkHandlers = await page.$(querySelector);
        console.log('start');

        let result = false;
        let elements = await page.$$(querySelector);
        for (let [i, link] of (elements.entries())) {
            if (i == selectionIndex) {
                // console.log('Selected index' + selectionIndex, link);
                await link.click();
                result = true;
                // await page.waitForNavigation({ waitUntil: 'load' });
                break;
            } else {
                result = false
            }
        }

        if (result) {
            return true;
            // await linkHandlers[0].click();
        } else {
            await this.delay(500);
            return await this.clickTickboxByIndex(page, selectionIndex, querySelector, awaitNavigation)
            // throw new Error("Link By Index: "+selectionIndex+". not found");
        }

        return false;
    }

}