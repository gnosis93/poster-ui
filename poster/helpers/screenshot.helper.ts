import { BaseHelper } from "./helper.base"
import * as puppeteer from 'puppeteer';
import { ConfigHelper } from "./config.helper";
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';

export class ScreenshootHelper extends BaseHelper{

    public static  async takeErrorScreenShot(msg:string,browser:puppeteer.Browser){
        return await this.takeScreenShot(msg,browser,'error');
    }

    public static async takeSuccessScreenShot(msg:string,browser:puppeteer.Browser){
        return await  this.takeScreenShot(msg,browser,'success');
    }

    private static async takeScreenShot(msg:string,browser:puppeteer.Browser,type:'error'|'success'){
        if(!browser || browser.isConnected() === false){
            console.warn('Failed to take '+type+' screenshot, browser is no longer connected');
            return;
        }
        let page = await this.getActivePage(browser);
        let fileName:any =  moment().format('HH:MM')+'_'+msg+'.jpg';
        fileName = fileName.replaceAll(':','-');
        fileName = fileName.replaceAll(' ','-');

        let fullPath:any = path.join(
            (await this.getScreenshotDir(type)),
            fileName
        );

        console.log(fileName,fullPath,moment().format('HH:MM'),msg)
        await page.screenshot({
            type: "jpeg",
            fullPage: true,
            path:fullPath
        });

        console.log(type+' screenshot saved at:'+fullPath);
    }

    private static async getScreenshotDir(ssType:'error'|'success'){
        let mainDataFolderPath = ScreenshootHelper.getMainContentPath();
        let ssPath = path.join(mainDataFolderPath,'screenshots')
        await this.makeDirIfNotExists(ssPath);

        let dateFolder = path.join(ssPath,this.getSSDateFolder());
        await this.makeDirIfNotExists(dateFolder);

        let ssPathType = path.join(dateFolder,ssType);
        await this.makeDirIfNotExists(ssPathType);

        return ssPathType;
        
    }

    private static makeDirIfNotExists(dirPath){
        if(fs.existsSync( dirPath ) === false){
            fs.mkdirSync(dirPath);
            return true;
        }
        return false;
    }

    private static getSSDateFolder():string{
        return moment().format('YYYY-MM-DD')
    }

    protected static async getActivePage(browser:puppeteer.Browser) :Promise<puppeteer.Page>{
        var timeout = ConfigHelper.getConfigValue<number>('navigation_timeout',10000);
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

}