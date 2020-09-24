//importing necessary modules
import path = require('path');
import fs   = require('fs');

export class ConfigHelper{

    private static configSingleton:any=null;


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
            let rawdata         = fs.readFileSync(configFilePath);
            ConfigHelper.configSingleton   = JSON.parse(rawdata.toString());
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
                "https://www.facebook.com/Test123-109118157588870/"
            ],
            "facebook_groups":[
                "https://www.facebook.com/groups/317055712850966"
            ],
            "headless":false,
            "phone_number":'090 048 9999',
            "phone_extension":'+66',
            "facebook_old_style":true,
            "chrome_executable_path":"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "craigslist_email":"hotdogcondos@gmail.com",
            "craigslist_password":"Miami5151+-*!!",
            "post_immediately":false,
            "english_text_template":"",
            "italian_text_template":"",
            "chinese_text_template":"",
            "thai_text_template":"",
        };
        fs.writeFileSync(configFilePath, JSON.stringify(jsonFileTemplate));
        return true;
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

    public static getPostsDir(){
        const {app}   = require('electron');
        const homedir = app.getPath('userData');
        let dirPath   = path.join(homedir, 'posts');
        return dirPath;
    }
}
