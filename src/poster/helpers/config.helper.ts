//importing necessary modules
import path = require('path');
import fs   = require('fs');

export class ConfigHelper{

    private static configSingleton:any=null;

    public static getConfig():any{
        if(ConfigHelper.configSingleton === null){
            let configFilePath  = ConfigHelper.getConfigFilePath();
            let rawdata         = fs.readFileSync(configFilePath);
            ConfigHelper.configSingleton   = JSON.parse(rawdata.toString());
        }
       
        return ConfigHelper.configSingleton;
    }

    public static createConfigFile(){
        ConfigHelper.configSingleton = null;
        let  configFilePath = ConfigHelper.getConfigFilePath();
        let fileExists = fs.existsSync(configFilePath);

        if(fileExists){
            return false;
        }

        let jsonFileTemplate = `
        {
            "facebook_email":"",
            "facebook_password":"",
            "facebook_pages":[],
            "facebook_groups":[]
        }`;
        fs.writeFileSync(configFilePath, jsonFileTemplate);
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
        return configFilePath;
    }

    public static getPostsDir(){
        const homedir = require('os').homedir();
        let dirPath   = path.join(homedir, 'posts');
        return dirPath;
    }
}
