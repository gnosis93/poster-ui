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
    ConfigHelper.createConfigFile = function () {
        ConfigHelper.configSingleton = null;
        var configFilePath = ConfigHelper.getConfigFilePath();
        var fileExists = fs.existsSync(configFilePath);
        if (fileExists) {
            return false;
        }
        var jsonFileTemplate = "\n        {\n            \"facebook_email\":\"\",\n            \"facebook_password\":\"\",\n            \"facebook_pages\":[],\n            \"facebook_groups\":[],\n            \"headless\":false,\n            \"chrome_executable_path\":\"/usr/bin/google-chrome\"\n        }";
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
        return configFilePath;
    };
    ConfigHelper.getPostsDir = function () {
        var homedir = require('os').homedir();
        var dirPath = path.join(homedir, 'posts');
        return dirPath;
    };
    ConfigHelper.configSingleton = null;
    return ConfigHelper;
}());
exports.ConfigHelper = ConfigHelper;
//# sourceMappingURL=config.helper.js.map