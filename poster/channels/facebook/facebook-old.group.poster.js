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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookOldGroupPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var FacebookOldGroupPoster = /** @class */ (function (_super) {
    __extends(FacebookOldGroupPoster, _super);
    function FacebookOldGroupPoster(postPages, credentials, imagesToPost, content) {
        var _this = _super.call(this) || this;
        _this.postPages = postPages;
        _this.credentials = credentials;
        _this.imagesToPost = imagesToPost;
        _this.content = content;
        _this.channelUrl = 'https://facebook.com/';
        _this.channelLoginUrl = 'https://en-gb.facebook.com/login/';
        if (!postPages || postPages.length === 0) {
            throw "Invalid Post pages given to FacebookGroupPoster";
        }
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookGroupPoster";
        }
        return _this;
    }
    FacebookOldGroupPoster.prototype.getImagesToPost = function () {
        return this.imagesToPost.filter(function (i) { return i.selected == true; }).map(function (i) { return i.imageURL; });
    };
    FacebookOldGroupPoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    FacebookOldGroupPoster.prototype.getPostPages = function () {
        return this.postPages;
    };
    FacebookOldGroupPoster.prototype.login = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var loginPage, _a, username, password;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.newPage()];
                    case 1:
                        loginPage = _b.sent();
                        _a = this.getCredentials(), username = _a.username, password = _a.password;
                        return [4 /*yield*/, loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loginPage.goto(this.channelLoginUrl, { waitUntil: 'networkidle2' })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#email', username)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#pass', password)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.click('#loginbutton')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, loginPage.waitForNavigation()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, loginPage];
                }
            });
        });
    };
    FacebookOldGroupPoster.prototype.run = function (onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var browser, loginPage, postedPages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lunchBrowser()];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, this.login(browser)];
                    case 2:
                        loginPage = _a.sent();
                        return [4 /*yield*/, this.postToPages(browser, onPageUploadedCallback)];
                    case 3:
                        postedPages = _a.sent();
                        if (!((config_helper_1.ConfigHelper.getConfigValue('headless', false)) === true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, browser.close()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    FacebookOldGroupPoster.prototype.postToPages = function (browser, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var pages, count, _i, _a, group, groupPage, inputUploadHandles, inputUploadHandle, filesToUpload, postButtonQuery, postButton, disabledJSHandle, disabledValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pages = [];
                        count = 0;
                        _i = 0, _a = this.getPostPages();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 20];
                        group = _a[_i];
                        count++;
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        groupPage = _b.sent();
                        // await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        return [4 /*yield*/, groupPage.goto(group, { waitUntil: 'networkidle2' })];
                    case 3:
                        // await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        _b.sent();
                        return [4 /*yield*/, groupPage.keyboard.press('p')];
                    case 4:
                        _b.sent();
                        // await groupPage.click('textarea#js_1g');
                        return [4 /*yield*/, groupPage.keyboard.type(this.content)];
                    case 5:
                        // await groupPage.click('textarea#js_1g');
                        _b.sent(); // click submit
                        return [4 /*yield*/, groupPage.click('a[loggingname="media_tab_selector"]')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, groupPage.$$('input[type=file]')];
                    case 8:
                        inputUploadHandles = _b.sent();
                        console.log(inputUploadHandles);
                        inputUploadHandle = inputUploadHandles[1];
                        filesToUpload = this.getImagesToPost();
                        // console.log('Post Images',filesToUpload);
                        return [4 /*yield*/, this.delay(100)];
                    case 9:
                        // console.log('Post Images',filesToUpload);
                        _b.sent();
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        //     await inputUploadHandle.uploadFile(fileToUpload);
                        // }
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, filesToUpload)];
                    case 10:
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        //     await inputUploadHandle.uploadFile(fileToUpload);
                        // }
                        _b.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 11:
                        _b.sent();
                        postButtonQuery = 'button[type=submit]._1mf7';
                        return [4 /*yield*/, groupPage.$$(postButtonQuery)];
                    case 12:
                        postButton = _b.sent();
                        _b.label = 13;
                    case 13:
                        if (!true) return [3 /*break*/, 17];
                        return [4 /*yield*/, postButton[0].getProperty('attributes')];
                    case 14:
                        disabledJSHandle = _b.sent();
                        return [4 /*yield*/, disabledJSHandle.jsonValue()];
                    case 15:
                        disabledValue = _b.sent();
                        // console.log('disabled attributes' , disabledValue);
                        // postButton[0].
                        // console.log(disabledValue);
                        if (typeof disabledValue['3'] === 'undefined') {
                            return [3 /*break*/, 17];
                        }
                        return [4 /*yield*/, this.delay(100)];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 17: return [4 /*yield*/, groupPage.click(postButtonQuery)];
                    case 18:
                        _b.sent();
                        if (onPageUploadedCallback !== null) {
                            onPageUploadedCallback(groupPage, count);
                        }
                        pages.push(groupPage);
                        _b.label = 19;
                    case 19:
                        _i++;
                        return [3 /*break*/, 1];
                    case 20: return [2 /*return*/, pages];
                }
            });
        });
    };
    FacebookOldGroupPoster.prototype.lunchBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                config = config_helper_1.ConfigHelper.getConfig();
                return [2 /*return*/, puppeteer.launch({
                        executablePath: config_helper_1.ConfigHelper.getConfigValue('chrome_executable_path'),
                        headless: config_helper_1.ConfigHelper.getConfigValue('headless', false),
                        defaultViewport: null,
                        args: ['--start-maximized', "--disable-notifications"]
                    })];
            });
        });
    };
    return FacebookOldGroupPoster;
}(channel_base_1.ChannelBase));
exports.FacebookOldGroupPoster = FacebookOldGroupPoster;
//# sourceMappingURL=facebook-old.group.poster.js.map