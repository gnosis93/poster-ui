import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { ConfigHelper } from '../helpers/config.helper';
const Stream = require('stream').Transform;                                


export class HotDogCondosImporter{

    private static readonly HOTDOGCONDOS_WEBSITE_URL = 'https://www.hotdogcondos.com'


    public async run():Promise<boolean>{
        let browser     = await this.lunchBrowser();
        let pagesUrls   = await this.scrapePagesUrls(browser);
        let propertiesUrls:Array<string> = [];

        for(let pageUrl of pagesUrls){
            let pagePropertiesUrls = await this.scrapeListingURLS(browser,pageUrl);
            propertiesUrls = propertiesUrls.concat(pagePropertiesUrls);
        }

        for(let propertyUrl of propertiesUrls){
            await this.scrapeProperty(browser,propertyUrl);
        }
        // this.scrapeListingURLS(browser,HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL);
        return true;
    }

    private async scrapePagesUrls(browser:puppeteer.Browser):Promise<Array<string>>{
        let page      = await browser.newPage();
        await page.goto(HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL,{ waitUntil: 'networkidle2' });
        const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.pagination li a'), element => element.getAttribute('href')));
        urls.pop();
        return urls;
        // 
    }

    private async scrapeProperty(browser:puppeteer.Browser,pageUrl:string){
        let page    = await browser.newPage();
        await page.goto(pageUrl,{ waitUntil: 'networkidle2' });  
        
        let title = await page.evaluate(() =>  document.querySelector("#listing-title") != null ? document.querySelector("#listing-title").textContent : null); 
        
        let images = await page.evaluate(() => Array.from( document.querySelectorAll(".listings-slider-image"), element => element.getAttribute('src')))  
        images = this.cleanImagesUrls(images);

        let textContent = await page.evaluate(() => document.querySelector("#listing-features .info-inner") != null ? document.querySelector("#listing-features .info-inner").textContent : null); 
        // console.log(title,images,textContent);
        
        //get path to post dir , stop execution if folder already exists
        let postDirectoryPath = path.join(this.getPostsDir(),title);
        let postDirectoryExists = fs.existsSync(postDirectoryPath);
        if(postDirectoryExists === true){
            return true;
        }

        //save content
        fs.mkdirSync(postDirectoryPath);
        fs.writeFileSync(path.join(postDirectoryPath,'text.txt'),textContent)
        
        //save images
        for(let imageUrl of images){
            this.downloadImage(path.join(postDirectoryPath,((new Date()).getTime() +'.jpg')),imageUrl );
        }
        await page.close();
        return true;
    }

    private getPostsDir():string{
        return path.join( require('os').homedir(),'posts')
    }

    private downloadImage(imagePath:string,imageUrl:string){
        https.request(imageUrl, function(response) {                                        
            var data = new Stream();                                                    
          
            response.on('data', function(chunk) {                                       
              data.push(chunk);                                                         
            });                                                                         
          
            response.on('end', function() {                                             
              fs.writeFileSync(imagePath, data.read());                               
            });                                                                         
          }).end();
    }

    private cleanImagesUrls(imagesUrls:Array<string>):Array<string>{
        let redefinedImagesUrl = [];
        for(let imageUrl of imagesUrls){
            let indexOfQuery        = imageUrl.indexOf('?');
            let imageUrlWithNoQuery = imageUrl.substr(0,indexOfQuery);
            redefinedImagesUrl.push(imageUrlWithNoQuery);
        }
        return redefinedImagesUrl;
    }

    private async scrapeListingURLS(browser:puppeteer.Browser,pageUrl:string):Promise<Array<string>>{
        let page    = await browser.newPage();
        await page.goto(pageUrl,{ waitUntil: 'networkidle2' });
        const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.listing-featured-image'), element => element.getAttribute('href')));
        
        return urls;
    }

    private async lunchBrowser():Promise<puppeteer.Browser>{
        let config = ConfigHelper.getConfig();

        return puppeteer.launch({
            headless: config.headless ?? true, 
            defaultViewport: null, 
            args: ['--start-maximized',"--disable-notifications"] 
        });
        
    } 
}