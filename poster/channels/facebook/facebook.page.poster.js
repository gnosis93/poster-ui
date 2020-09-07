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
exports.FacebookPagePoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var FacebookPagePoster = /** @class */ (function (_super) {
    __extends(FacebookPagePoster, _super);
    function FacebookPagePoster(postPages, credentials, imagesToPost, content) {
        var _this = _super.call(this) || this;
        _this.postPages = postPages;
        _this.credentials = credentials;
        _this.imagesToPost = imagesToPost;
        _this.content = content;
        _this.channelUrl = 'https://facebook.com/';
        if (!postPages || postPages.length === 0) {
            throw "Invalid Post pages given to FacebookPagePoster";
        }
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookPagePoster";
        }
        return _this;
    }
    FacebookPagePoster.prototype.getImagesToPost = function () {
        return this.imagesToPost;
    };
    FacebookPagePoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    FacebookPagePoster.prototype.getPostPages = function () {
        return this.postPages;
    };
    FacebookPagePoster.prototype.login = function (browser) {
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
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'networkidle2' })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#email', username)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#pass', password)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.click('#u_0_d')];
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
    FacebookPagePoster.prototype.run = function (onPageUploadedCallback) {
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
                        postedPages = this.postToPages(browser, onPageUploadedCallback);
                        if (!((config_helper_1.ConfigHelper.getConfigValue('headless', false)) === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser.close()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    FacebookPagePoster.prototype.postToPages = function (browser, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var pages, count, _i, _a, group, groupPage, inputUploadHandles, inputUploadHandle, filesToUpload, _b, filesToUpload_1, fileToUpload, postButtonXPath, postButton, disabledJSHandle, disabledValue;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pages = [];
                        count = 0;
                        _i = 0, _a = this.getPostPages();
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 22];
                        group = _a[_i];
                        count++;
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        groupPage = _c.sent();
                        return [4 /*yield*/, groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, groupPage.goto(group, { waitUntil: 'networkidle2' })];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, groupPage.click('div[aria-label="Create Post"]')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, groupPage.keyboard.type(this.content)];
                    case 7:
                        _c.sent(); // click submit
                        return [4 /*yield*/, groupPage.$$('input[type=file]')];
                    case 8:
                        inputUploadHandles = _c.sent();
                        inputUploadHandle = inputUploadHandles[2];
                        filesToUpload = this.getImagesToPost();
                        return [4 /*yield*/, groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm')];
                    case 9:
                        _c.sent();
                        _b = 0, filesToUpload_1 = filesToUpload;
                        _c.label = 10;
                    case 10:
                        if (!(_b < filesToUpload_1.length)) return [3 /*break*/, 13];
                        fileToUpload = filesToUpload_1[_b];
                        return [4 /*yield*/, inputUploadHandle.uploadFile(fileToUpload)];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        _b++;
                        return [3 /*break*/, 10];
                    case 13:
                        postButtonXPath = "//div[text()='Post']";
                        postButton = null;
                        _c.label = 14;
                    case 14:
                        if (!true) return [3 /*break*/, 19];
                        return [4 /*yield*/, groupPage.$x(postButtonXPath)];
                    case 15:
                        postButton = _c.sent();
                        return [4 /*yield*/, postButton[0].getProperty('attributes')];
                    case 16:
                        disabledJSHandle = _c.sent();
                        return [4 /*yield*/, disabledJSHandle.jsonValue()];
                    case 17:
                        disabledValue = _c.sent();
                        // postButton[0].
                        // console.log(disabledValue);
                        if (postButton.length !== 0 &&
                            typeof disabledValue['3'] === 'undefined') {
                            return [3 /*break*/, 19];
                        }
                        return [4 /*yield*/, this.delay(100)];
                    case 18:
                        _c.sent();
                        return [3 /*break*/, 14];
                    case 19: return [4 /*yield*/, postButton[0].click()];
                    case 20:
                        _c.sent();
                        if (onPageUploadedCallback !== null) {
                            onPageUploadedCallback(groupPage, count);
                        }
                        pages.push(groupPage);
                        _c.label = 21;
                    case 21:
                        _i++;
                        return [3 /*break*/, 1];
                    case 22: return [2 /*return*/, pages];
                }
            });
        });
    };
    FacebookPagePoster.prototype.lunchBrowser = function () {
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
    return FacebookPagePoster;
}(channel_base_1.ChannelBase));
exports.FacebookPagePoster = FacebookPagePoster;
//# sourceMappingURL=facebook.page.poster.js.map