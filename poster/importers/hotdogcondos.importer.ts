import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { ConfigHelper } from '../helpers/config.helper';
import { PostMetaData } from '../models/post.interface';
import { PostsHelper } from '../helpers/posts.helper';
const Stream = require('stream').Transform;                                

export class HotDogCondosImporter{

    private static readonly HOTDOGCONDOS_WEBSITE_SELL_URL = 'https://www.hotdogcondos.com';
    private static readonly HOTDOGCONDOS_WEBSITE_RENT_URL = 'https://hotdogcondos.com/rent/?search-listings=true';

    private static TIMEOUT = 100000;//defualt

    public async run():Promise<boolean>{
        HotDogCondosImporter.TIMEOUT = await ConfigHelper.getConfigValue<number>('navigation_timeout', HotDogCondosImporter.TIMEOUT );
        let browser     = await this.lunchBrowser();

        let mainPage    = await browser.newPage();

        let pagesUrls   = await this.scrapeRentPagesUrls(mainPage);
        pagesUrls       = pagesUrls.concat( await this.scrapeSellPagesUrls(mainPage));
        
        let propertiesUrls:Array<string> = [];
      
        for(let pageUrl of pagesUrls){
            let pagePropertiesUrls = await this.scrapeListingURLS(mainPage,pageUrl);
            propertiesUrls = propertiesUrls.concat(pagePropertiesUrls);
        }

        const existingUrls = await this.getExistingPostsUrls();
     
        let newUrls = propertiesUrls.filter(url => existingUrls.includes(url) === false)
        newUrls = newUrls.filter((v, i, a) => a.indexOf(v) === i);//remove duplicates

        for(let propertyUrl of newUrls){
            await this.scrapeProperty(propertyUrl,mainPage);
        }

        // if((ConfigHelper.getConfigValue('headless',false) ) === true){
            await browser.close();
        // }
        // this.scrapeListingURLS(browser,HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL);
        return true;
    }

    private async getExistingPostsUrls(){
        let posts = await PostsHelper.getListOfPosts();
        let urls = [];
        
        for(let postName of posts.postsDirs){
            let post = await PostsHelper.getPostByName(postName);
            let postUrl = post?.metaData?.url ?? null;
            if(postUrl !== null){
                urls.push(postUrl);
            }
        }
        return urls;
    }

    private async scrapeSellPagesUrls(page:puppeteer.Page):Promise<Array<string>>{
        // let page      = await browser.newPage();
        await page.goto(HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_SELL_URL,{ waitUntil: 'networkidle2' , timeout:HotDogCondosImporter.TIMEOUT});
        const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.pagination li a'), element => element.getAttribute('href')));
        urls.pop();
        if(urls.length == 0){
            return [HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_SELL_URL]
        }  
        return urls;
    }

    private async scrapeRentPagesUrls(page:puppeteer.Page):Promise<Array<string>>{
        // let page      = await browser.newPage();
        await page.goto(HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_RENT_URL,{ waitUntil: 'networkidle2' , timeout:HotDogCondosImporter.TIMEOUT});
        const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.pagination li a'), element => element.getAttribute('href')));
        urls.pop();
        
        if(urls.length == 0){
            return [HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_RENT_URL]
        }
        
        return urls;
    }


    private async processPropertyFeatures(propertyMetaData:PostMetaData){
        let text = `${propertyMetaData.title} is a new project that can be a great new investment opportunity or a place to call home . Located in Pattaya a highly touristic city with all the amenities you can imagine ! 

More info at : ${propertyMetaData.url}

Property Features: 
${propertyMetaData.features}

Call for view:  ${ConfigHelper.getConfigValue('phone_extension') + ' ' + ConfigHelper.getConfigValue('phone_number')}
        `;
        return text;
    }

    private htmlDecode(input:string):string {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        let processedInput = input.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
        processedInput = processedInput.replace('amp;','');
        return processedInput;
    }

    private async scrapeProperty(pageUrl:string, page:puppeteer.Page){
        // let page    = await browser.newPage();
        await page.goto(pageUrl,{ waitUntil: 'networkidle2' ,timeout:HotDogCondosImporter.TIMEOUT});  
        
        let title = await page.evaluate(() =>  document.querySelector("#listing-title") != null ? document.querySelector("#listing-title").innerHTML : null); 
        title = this.htmlDecode(title);
        let images = await page.evaluate(() => Array.from( document.querySelectorAll(".listings-slider-image"), element => element.getAttribute('src')))  
        images = this.cleanImagesUrls(images);

        let propertyFeatures = await page.evaluate(() => {
           let selector = document.querySelector("#listing-features .info-inner") as HTMLElement;
            if(selector == null){
               return null;
            }
            return selector.innerText
        }); 
        // console.log(title,images,textContent);
        
        //get path to post dir , stop execution if folder already exists
        let postDirectoryPath = path.join(this.getPostsDir(),title);
        let postDirectoryExists = fs.existsSync(postDirectoryPath);
        if(postDirectoryExists === true){
            return true;
        }

        let beds            = await page.evaluate(() =>  document.querySelector("#single-listing-propinfo>.beds>.right") != null ? document.querySelector("#single-listing-propinfo>.beds>.right").textContent : null); 
        let baths           = await page.evaluate(() =>  document.querySelector("#single-listing-propinfo>.baths>.right") != null ? document.querySelector("#single-listing-propinfo>.baths>.right").textContent : null); 
        let size            = await page.evaluate(() =>  document.querySelector("#single-listing-propinfo>.sqft>.right") != null ? document.querySelector("#single-listing-propinfo>.sqft>.right").textContent : null); 
        let floorNumber     = await page.evaluate(() =>  document.querySelector("#single-listing-propinfo>.community>.right") != null ? document.querySelector("#single-listing-propinfo>.community>.right").textContent : null); 
        let price           = await page.evaluate(() =>  document.querySelector(".listing-price") != null ? document.querySelector(".listing-price").textContent : null); 
        let rentalPrice     = await page.evaluate(() =>  document.querySelector(".listing-price-postfix") != null ? document.querySelector(".listing-price-postfix").textContent : null);
        
        if(price){
            price = price.replace(/\D/g,'');
        }
       
        if(rentalPrice){
            rentalPrice = rentalPrice.replace(/\D/g,'');
        }
        
        let metadata:PostMetaData = {
            'title'      : title,
            'url'        : pageUrl,
            'beds'       : beds,
            'baths'      : baths,
            'size'       : size,
            'floorNumber': floorNumber,
            'price'      : price,
            'features'   : propertyFeatures,
            'rentalPrice': rentalPrice,
            'type'       : rentalPrice !== null ? 'rental' : 'sell'
        }

        console.log(metadata);
        //save content
        fs.mkdirSync(postDirectoryPath);

        let textContent      = await this.processPropertyFeatures(metadata);
        fs.writeFileSync(path.join(postDirectoryPath,'text.txt'),textContent)
        
        this.writeJSONToFile(postDirectoryPath,'metadata.json', metadata);

        //save images
        for(let imageUrl of images){
            this.downloadImage( path.join( postDirectoryPath, ((new Date()).getTime() +'.jpg')), imageUrl );
        }
        return true;
    }


    private writeJSONToFile(dirPath:string,fileName:string,content:any){
        let encodedContent = JSON.stringify(content);
        return fs.writeFileSync(path.join(dirPath,fileName),encodedContent);
    }

    private getPostsDir():string{
        const {app} = require('electron');
        return path.join( app.getPath('userData'),'posts')
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

    private async scrapeListingURLS(page:puppeteer.Page,pageUrl:string):Promise<Array<string>>{
        await page.goto(pageUrl,{ waitUntil: 'networkidle2',timeout:HotDogCondosImporter.TIMEOUT });
        const urls = await page.evaluate(() => Array.from(document.querySelectorAll('.listing-featured-image'), element => element.getAttribute('href')));
        return urls;
    }

    private async lunchBrowser():Promise<puppeteer.Browser>{
        let config = ConfigHelper.getConfig();
        // if((ConfigHelper.getConfigValue('headless',false) ) === true){

        let browser = puppeteer.launch({
            executablePath:ConfigHelper.getConfigValue('chrome_executable_path'),
            headless: ConfigHelper.getConfigValue('headless',false), 
            defaultViewport: null, 
            args: ['--start-maximized',"--disable-notifications"] 
        });
        return browser;
    } 
}