//importing necessary modules
import path = require('path');
import fs   = require('fs');
import { Post } from '../models/post.interface';
import { BaseHelper } from './helper.base';

export class ConfigHelper extends BaseHelper{

    private static configSingleton:any=null;
    private static readonly defaultLang = 'english';

    public static getConfigValue<T=any>(valueKey:string,defaultValue:any=null):T{
        let config = ConfigHelper.getConfig();
        if(typeof config[valueKey] === 'undefined'){
            return defaultValue
        }
        return config[valueKey];
    }

    public static restoreConfigToDefaults(){
        let configFilePath  = ConfigHelper.getConfigFilePath();
        let fileExists = fs.existsSync(configFilePath);
        if(fileExists){
            fs.unlinkSync(configFilePath);
        }
        ConfigHelper.createConfigFile();
        return true;
    }

    public static getConfig():any{
        if(ConfigHelper.configSingleton === null){
            let configFilePath  = ConfigHelper.getConfigFilePath();
            let rawData         = fs.readFileSync(configFilePath);
            ConfigHelper.configSingleton   = JSON.parse(rawData.toString());
        }
        return ConfigHelper.configSingleton;
    }

    // public static validateConfigData(posting: boolean ):string{
    //     let value = "";
    //     let config = this.getConfig();
    //     if(posting && config.facebook_pages.length == 0){
    //         value = 'The list of Facebook Pages is empty in Config.';
    //     }else if(posting && config.facebook_groups.length == 0){
    //         value = 'The list of Facebook Groups is empty in Config.';
    //     }else if(config.chrome_executable_path == ""){
    //         value = 'Chrome Executable Path is not set in Config.';
    //     }else if(!fs.existsSync(config.chrome_executable_path)){
    //         value = 'Chrome Executable Path is not valid in Config.';
    //     }
    //     if(value === ""){
    //         console.log('no config validation error found');
    //     }else{
    //         console.error('config validation value error: '+value);
    //     }
    //     return value;
    // }

   
    public static createConfigFile(){
        ConfigHelper.configSingleton = null;
        let  configFilePath = ConfigHelper.getConfigFilePath();
        let fileExists = fs.existsSync(configFilePath);

        if(fileExists){
            return false;
        }

        let jsonFileTemplate =
        {
            "facebook_email":"aaronscifo@gmail.com",
            "facebook_password":"Miami5151+-*",
            "facebook_pages":[
                "https://www.facebook.com/Test123-109118157588870"
            ],
            "facebook_groups":[
                "https://www.facebook.com/groups/317055712850966"
            ],
            "headless":false,
            "phone_number":'900 489999',
            "phone_extension":'+66',
            "facebook_old_style":true,
            "chrome_executable_path":"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "craigslist_email":"hotdogcondos@gmail.com",
            "craigslist_password":"Miami5151+-*!!",
            "bathsold_email":"hotdogcondos@gmail.com",
            "bathsold_password":"Miami5151+-*!!",
            "livinginsider_email":"mkmardel@gmail.com",
            "livinginsider_password":"33gh44",
            "post_immediately":false,

            "english_text_template":`{title} is a new project that can be a great new investment opportunity or a place to call home . Located in Pattaya a highly touristic city with all the amenities you can imagine ! 
More info at : {url}
Property Features:
{features}
Call for view:  {phone_extension} {phone_number')}
            `,
            "italian_text_template":`{title} è un nuovo progetto che può essere una nuova grande opportunità di investimento o un posto da chiamare casa. Situato a Pattaya, una città altamente turistica con tutti i comfort che puoi immaginare!
            Maggiori informazioni su: {url}
            Chiamaci al numero: {phone_extension} {phone_number}`,
            "chinese_text_template":"",
            "russian_text_template":"",
            "thai_text_template":"",
            "close_browser":true,
            "post_in_sequential_order":true,
            
            "criagslist_enable_scheduler":false,
            "criagslist_scheduler_cron":"0 * * * *",
            'criagslist_postings_per_trigger':1

        };
        fs.writeFileSync(configFilePath, JSON.stringify(jsonFileTemplate));
        return true;
    }

    public static parseTextTemplate(post:Post,lang:string):string{
        if(Array.isArray(post.postText) === false){
            return post.content;
        }
        let templateText = post.postText.find(p => p.language === lang);
        //handle no text in template
        if(!templateText || templateText.text.length === 0){
            //if no text is defined for the given lang use default
            templateText = post.postText.find(p => p.language === this.defaultLang);
            //if default template text empty , than use default content 
            if(!templateText){
                return post.content;
            }
        }

        let textParsed  = String(templateText.text);
        textParsed      = textParsed.replace('{title}',post.metaData.title ?? '');
        textParsed      = textParsed.replace('{beds}',post.metaData.beds ?? '');
        textParsed      = textParsed.replace('{bathrooms}',post.metaData.baths ?? '');
        textParsed      = textParsed.replace('{floorNumber}',post.metaData.floorNumber ?? '');
        textParsed      = textParsed.replace('{size}',post.metaData.size ?? '');
        textParsed      = textParsed.replace('{url}',post.metaData.url ?? '');
        textParsed      = textParsed.replace('{features}',post.metaData.features ?? '');
        textParsed      = textParsed.replace('{phone_extension}',ConfigHelper.getConfigValue('phone_extension',''));
        textParsed      = textParsed.replace('{phone_number}',ConfigHelper.getConfigValue('phone_number',''));
        textParsed      = textParsed.replace('null','');

        return textParsed;
    }


    public static saveConfig(newConfigContent:string){
        ConfigHelper.configSingleton = null;
        let  configFilePath = ConfigHelper.getConfigFilePath();
        fs.writeFileSync(configFilePath, newConfigContent);
        return true;
    }

    private static getConfigFilePath(){
        let postDirPath = ConfigHelper.getPostsDir();
        if(fs.existsSync( postDirPath ) === false){
          fs.mkdirSync(postDirPath);
        }
        let configFilePath = path.join(postDirPath,'config.json');
        console.log(configFilePath);
        return configFilePath;
    }

    
}
