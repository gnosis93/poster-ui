"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
//importing necessary modules
var path = require("path");
var fs = require("fs");
var ConfigHelper = /** @class */ (function () {
    function ConfigHelper() {
    }
    ConfigHelper.getConfigValue = function (valueKey, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var config = ConfigHelper.getConfig();
        if (typeof config[valueKey] === 'undefined') {
            return defaultValue;
        }
        return config[valueKey];
    };
    ConfigHelper.getConfig = function () {
        if (ConfigHelper.configSingleton === null) {
            var configFilePath = ConfigHelper.getConfigFilePath();
            var rawdata = fs.readFileSync(configFilePath);
            ConfigHelper.configSingleton = JSON.parse(rawdata.toString());
        }
        return ConfigHelper.configSingleton;
    };
    ConfigHelper.validateConfigData = function (posting) {
        var value = "";
        var config = this.getConfig();
        if (posting && config.facebook_pages.length == 0) {
            value = 'The list of Facebook Pages is empty in Config.';
        }
        else if (posting && config.facebook_groups.length == 0) {
            value = 'The list of Facebook Groups is empty in Config.';
        }
        else if (config.chrome_executable_path == "") {
            value = 'Chrome Executable Path is not set in Config.';
        }
        else if (!fs.existsSync(config.chrome_executable_path)) {
            value = 'Chrome Executable Path is not valid in Config.';
        }
        console.log('config validation value: ' + value);
        return value;
    };
    ConfigHelper.createConfigFile = function () {
        ConfigHelper.configSingleton = null;
        var configFilePath = ConfigHelper.getConfigFilePath();
        var fileExists = fs.existsSync(configFilePath);
        if (fileExists) {
            return false;
        }
        var jsonFileTemplate = "\n        {\n            \"facebook_email\":\"\",\n            \"facebook_password\":\"\",\n            \"facebook_pages\":[],\n            \"facebook_groups\":[],\n            \"headless\":false,\n            \"chrome_executable_path\":\"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome\"\n        }";
        fs.writeFileSync(configFilePath, jsonFileTemplate);
        return true;
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
    ConfigHelper.getPostsDir = function () {
        var app = require('electron').app;
        var homedir = app.getPath('userData');
        var dirPath = path.join(homedir, 'posts');
        return dirPath;
    };
    ConfigHelper.configSingleton = null;
    return ConfigHelper;
}());
exports.ConfigHelper = ConfigHelper;
//# sourceMappingURL=config.helper.js.map