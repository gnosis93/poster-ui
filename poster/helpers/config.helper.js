"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
//importing necessary modules
var path = require("path");
var fs = require("fs");
var helper_base_1 = require("./helper.base");
var ConfigHelper = /** @class */ (function (_super) {
    __extends(ConfigHelper, _super);
    function ConfigHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfigHelper.getConfigValue = function (valueKey, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var config = ConfigHelper.getConfig();
        if (typeof config[valueKey] === 'undefined') {
            return defaultValue;
        }
        return config[valueKey];
    };
    ConfigHelper.restoreConfigToDefaults = function () {
        var configFilePath = ConfigHelper.getConfigFilePath();
        var fileExists = fs.existsSync(configFilePath);
        if (fileExists) {
            fs.unlinkSync(configFilePath);
        }
        ConfigHelper.createConfigFile();
        return true;
    };
    ConfigHelper.getConfig = function () {
        if (ConfigHelper.configSingleton === null) {
            var configFilePath = ConfigHelper.getConfigFilePath();
            var rawData = fs.readFileSync(configFilePath);
            ConfigHelper.configSingleton = JSON.parse(rawData.toString());
        }
        return ConfigHelper.configSingleton;
    };
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
    ConfigHelper.createConfigFile = function () {
        ConfigHelper.configSingleton = null;
        var configFilePath = ConfigHelper.getConfigFilePath();
        var fileExists = fs.existsSync(configFilePath);
        if (fileExists) {
            return false;
        }
        var jsonFileTemplate = {
            "facebook_email": "aaronscifo@gmail.com",
            "facebook_password": "Miami5151+-*",
            "facebook_pages": [
                "https://www.facebook.com/Test123-109118157588870/"
            ],
            "facebook_groups": [
                "https://www.facebook.com/groups/317055712850966"
            ],
            "headless": false,
            "phone_number": '900 489999',
            "phone_extension": '+66',
            "facebook_old_style": true,
            "chrome_executable_path": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "craigslist_email": "hotdogcondos@gmail.com",
            "craigslist_password": "Miami5151+-*!!",
            "livinginsider_email": "hotdogcondos@gmail.com",
            "livinginsider_password": "Miami5151+-*!!",
            "post_immediately": false,
            "english_text_template": "{title} is a new project that can be a great new investment opportunity or a place to call home . Located in Pattaya a highly touristic city with all the amenities you can imagine ! \nMore info at : {url}\nProperty Features:\n{features}\nCall for view:  {phone_extension} {phone_number')}\n            ",
            "italian_text_template": "{title} \u00E8 un nuovo progetto che pu\u00F2 essere una nuova grande opportunit\u00E0 di investimento o un posto da chiamare casa. Situato a Pattaya, una citt\u00E0 altamente turistica con tutti i comfort che puoi immaginare!\n            Maggiori informazioni su: {url}\n            Chiamaci al numero: {phone_extension} {phone_number ')}",
            "chinese_text_template": "",
            "russian_text_template": "",
            "thai_text_template": "",
            "close_browser": true,
            "post_in_sequential_order": true,
            "enable_scheduler": false,
            "scheduler_cron": "0 * * * *",
            'postings_per_trigger': 1
        };
        fs.writeFileSync(configFilePath, JSON.stringify(jsonFileTemplate));
        return true;
    };
    ConfigHelper.parseTextTemplate = function (post, lang) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        if (Array.isArray(post.postText) === false) {
            return post.content;
        }
        var templateText = post.postText.find(function (p) { return p.language === lang; });
        //handle no text in template
        if (!templateText || templateText.text.length === 0) {
            //if no text is defined for the given lang use default
            templateText = post.postText.find(function (p) { return p.language === _this.defaultLang; });
            //if default template text empty , than use default content 
            if (!templateText) {
                return post.content;
            }
        }
        var textParsed = String(templateText.text);
        textParsed = textParsed.replace('{title}', (_a = post.metaData.title) !== null && _a !== void 0 ? _a : '');
        textParsed = textParsed.replace('{beds}', (_b = post.metaData.beds) !== null && _b !== void 0 ? _b : '');
        textParsed = textParsed.replace('{bathrooms}', (_c = post.metaData.baths) !== null && _c !== void 0 ? _c : '');
        textParsed = textParsed.replace('{floorNumber}', (_d = post.metaData.floorNumber) !== null && _d !== void 0 ? _d : '');
        textParsed = textParsed.replace('{size}', (_e = post.metaData.size) !== null && _e !== void 0 ? _e : '');
        textParsed = textParsed.replace('{url}', (_f = post.metaData.url) !== null && _f !== void 0 ? _f : '');
        textParsed = textParsed.replace('{features}', (_g = post.metaData.features) !== null && _g !== void 0 ? _g : '');
        textParsed = textParsed.replace('{phone_extension}', ConfigHelper.getConfigValue('phone_extension', ''));
        textParsed = textParsed.replace('{phone_number}', ConfigHelper.getConfigValue('phone_number', ''));
        textParsed = textParsed.replace('null', '');
        return textParsed;
    };
    ConfigHelper.saveConfig = function (newConfigContent) {
        ConfigHelper.configSingleton = null;
        var configFilePath = ConfigHelper.getConfigFilePath();
        fs.writeFileSync(configFilePath, newConfigContent);
        return true;
    };
    ConfigHelper.getConfigFilePath = function () {
        var postDirPath = ConfigHelper.getPostsDir();
        if (fs.existsSync(postDirPath) === false) {
            fs.mkdirSync(postDirPath);
        }
        var configFilePath = path.join(postDirPath, 'config.json');
        console.log(configFilePath);
        return configFilePath;
    };
    ConfigHelper.configSingleton = null;
    ConfigHelper.defaultLang = 'english';
    return ConfigHelper;
}(helper_base_1.BaseHelper));
exports.ConfigHelper = ConfigHelper;
//# sourceMappingURL=config.helper.js.map