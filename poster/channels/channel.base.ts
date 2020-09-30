import * as puppeteer from 'puppeteer';
import * as path from 'path';
const {app} = require('electron');

export abstract class ChannelBase {



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


    protected async getActivePage(browser:puppeteer.Browser, timeout:number) {
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