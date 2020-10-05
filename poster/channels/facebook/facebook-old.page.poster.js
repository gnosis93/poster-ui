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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookOldPagePoster = void 0;
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var FacebookOldPagePoster = /** @class */ (function (_super) {
    __extends(FacebookOldPagePoster, _super);
    function FacebookOldPagePoster(postPages, credentials, imagesToPost, content) {
        var _this = _super.call(this) || this;
        _this.postPages = postPages;
        _this.credentials = credentials;
        _this.imagesToPost = imagesToPost;
        _this.content = content;
        _this.channelUrl = 'https://facebook.com/';
        _this.channelLoginUrl = 'https://en-gb.facebook.com/login/';
        if (!postPages || postPages.length === 0) {
            throw "Invalid Post pages given to FacebookPagePoster";
        }
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookPagePoster";
        }
        return _this;
    }
    FacebookOldPagePoster.prototype.getImagesToPost = function () {
        return this.imagesToPost.filter(function (i) { return i.selected == true; }).map(function (i) { return i.imageURL; });
    };
    FacebookOldPagePoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    FacebookOldPagePoster.prototype.getPostPages = function () {
        return this.postPages;
    };
    FacebookOldPagePoster.prototype.login = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var loginPage, _a, username, password;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getActivePage(browser, 100)];
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
    FacebookOldPagePoster.prototype.run = function (onPageUploadedCallback) {
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
                        if (!((config_helper_1.ConfigHelper.getConfigValue('headless', false)) === true || config_helper_1.ConfigHelper.getConfigValue('close_browser'))) return [3 /*break*/, 5];
                        return [4 /*yield*/, browser.close()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    FacebookOldPagePoster.prototype.postToPages = function (browser, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var pages, count, _a, _b, group, groupPage, postButtonXPath, inputUploadHandles, inputUploadHandle, filesToUpload, filesToUpload_1, filesToUpload_1_1, image, e_1_1, postButton, e_2_1;
            var e_2, _c, e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        pages = [];
                        count = 0;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 23, 24, 25]);
                        _a = __values(this.getPostPages()), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 22];
                        group = _b.value;
                        count++;
                        return [4 /*yield*/, browser.newPage()];
                    case 3:
                        groupPage = _e.sent();
                        return [4 /*yield*/, groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, groupPage.goto(group, { waitUntil: 'networkidle2' })];
                    case 5:
                        _e.sent();
                        // await groupPage.click('div[aria-label="Create Post"]');
                        // await this.delay(2000);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        // }
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        return [4 /*yield*/, groupPage.click('textarea[title="Write a post..."]')];
                    case 6:
                        // await groupPage.click('div[aria-label="Create Post"]');
                        // await this.delay(2000);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        // }
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        _e.sent();
                        return [4 /*yield*/, this.delay(100)];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, groupPage.keyboard.type(this.content)];
                    case 8:
                        _e.sent(); // click submit
                        postButtonXPath = "//span[text()='Post']";
                        return [4 /*yield*/, groupPage.$$('input[type=file]')];
                    case 9:
                        inputUploadHandles = _e.sent();
                        inputUploadHandle = inputUploadHandles[1];
                        filesToUpload = this.getImagesToPost();
                        _e.label = 10;
                    case 10:
                        _e.trys.push([10, 16, 17, 18]);
                        filesToUpload_1 = (e_1 = void 0, __values(filesToUpload)), filesToUpload_1_1 = filesToUpload_1.next();
                        _e.label = 11;
                    case 11:
                        if (!!filesToUpload_1_1.done) return [3 /*break*/, 15];
                        image = filesToUpload_1_1.value;
                        return [4 /*yield*/, inputUploadHandle.uploadFile(image)];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14:
                        filesToUpload_1_1 = filesToUpload_1.next();
                        return [3 /*break*/, 11];
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 18];
                    case 17:
                        try {
                            if (filesToUpload_1_1 && !filesToUpload_1_1.done && (_d = filesToUpload_1.return)) _d.call(filesToUpload_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 18: return [4 /*yield*/, this.delay(2000)];
                    case 19:
                        _e.sent();
                        return [4 /*yield*/, groupPage.click('button[type="submit"][value="1"]._1mf7')];
                    case 20:
                        postButton = _e.sent();
                        // while(true){
                        //     let disabledJSHandle = await postButton[0].getProperty('attributes');
                        //     let disabledValue = await disabledJSHandle.jsonValue();//when the disabled attribute is not present only 3 values are present
                        //     // postButton[0].
                        //     // console.log(disabledValue);
                        //     if(
                        //         postButton.length !== 0 &&
                        //         typeof disabledValue['3'] === 'undefined'
                        //     ){
                        //         break;
                        //     }
                        //     await this.delay(100);
                        // }
                        // await postButton[0].click()
                        if (onPageUploadedCallback !== null) {
                            onPageUploadedCallback(groupPage, count);
                        }
                        pages.push(groupPage);
                        _e.label = 21;
                    case 21:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 22: return [3 /*break*/, 25];
                    case 23:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 25];
                    case 24:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 25: return [2 /*return*/, pages];
                }
            });
        });
    };
    return FacebookOldPagePoster;
}(channel_base_1.ChannelBase));
exports.FacebookOldPagePoster = FacebookOldPagePoster;
//# sourceMappingURL=facebook-old.page.poster.js.map