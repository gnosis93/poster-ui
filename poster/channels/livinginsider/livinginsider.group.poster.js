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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
exports.LivinginsiderPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var LivinginsiderPoster = /** @class */ (function (_super) {
    __extends(LivinginsiderPoster, _super);
    function LivinginsiderPoster(credentials, imagesToPost, thaiContent, englishContent, title, location, price, surfaceArea, phoneNumber, phoneExtension, immediatelyPost) {
        var _this = _super.call(this) || this;
        _this.credentials = credentials;
        _this.imagesToPost = imagesToPost;
        _this.thaiContent = thaiContent;
        _this.englishContent = englishContent;
        _this.title = title;
        _this.location = location;
        _this.price = price;
        _this.surfaceArea = surfaceArea;
        _this.phoneNumber = phoneNumber;
        _this.phoneExtension = phoneExtension;
        _this.immediatelyPost = immediatelyPost;
        _this.channelUrl = 'https://livinginsider.com/en';
        _this.channelLoginUrl = '';
        _this.chromeSessionPath = 'LivinginsiderSession'; //this will not work on windows , will work fine on UNIX like OSes
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to LivinginsiderGroupPoster";
        }
        return _this;
    }
    LivinginsiderPoster.prototype.getImagesToPost = function () {
        return this.imagesToPost.filter(function (i) { return i.selected == true; }).map(function (i) { return i.imageURL; });
    };
    LivinginsiderPoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    LivinginsiderPoster.prototype.login = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var loginPage, _a, username, password, closeAdModalSelector, _b, _c, _d, e_1, openLoginSelector, _e, _f, _g, loginUsernameSelector;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, browser.newPage()];
                    case 1:
                        loginPage = _h.sent();
                        _a = this.getCredentials(), username = _a.username, password = _a.password;
                        return [4 /*yield*/, loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'load', timeout: 0 })];
                    case 3:
                        _h.sent(); //its ok for me now
                        closeAdModalSelector = '.modal-dialog>.modal-content>.modal-body>a.hideBanner[data-dismiss="modal"][onclick="ActiveBanner.closeActiveBanner();"]';
                        return [4 /*yield*/, this.delay(1000)];
                    case 4:
                        _h.sent();
                        _h.label = 5;
                    case 5:
                        _h.trys.push([5, 8, , 9]);
                        _c = (_b = Promise).all;
                        _d = [loginPage.waitForSelector(closeAdModalSelector)];
                        return [4 /*yield*/, loginPage.click(closeAdModalSelector)];
                    case 6: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _h.sent(),
                                this.delay(500)
                            ])])];
                    case 7:
                        _h.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _h.sent();
                        console.log('Exception raised, no ad modal popup to close found');
                        return [3 /*break*/, 9];
                    case 9:
                        openLoginSelector = 'li#none_login_zone>a[data-target="#loginModal"]';
                        _f = (_e = Promise).all;
                        _g = [
                            // loginPage.waitForNavigation({ waitUntil: 'load' }),
                            loginPage.waitForSelector(openLoginSelector)];
                        return [4 /*yield*/, loginPage.click(openLoginSelector)];
                    case 10: 
                    // await this.delay(500);
                    return [4 /*yield*/, _f.apply(_e, [_g.concat([
                                _h.sent(),
                                this.delay(500)
                            ])])];
                    case 11:
                        // await this.delay(500);
                        _h.sent();
                        loginUsernameSelector = '#login_username';
                        return [4 /*yield*/, loginPage.waitForSelector('#login_username')];
                    case 12:
                        _h.sent();
                        return [4 /*yield*/, loginPage.type(loginUsernameSelector, username)];
                    case 13:
                        _h.sent();
                        return [4 /*yield*/, loginPage.type('#password', password)];
                    case 14:
                        _h.sent();
                        return [4 /*yield*/, loginPage.click('#btn-signin')];
                    case 15:
                        _h.sent();
                        // await loginPage.waitForNavigation();
                        return [2 /*return*/, loginPage];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.closePage = function (browser, page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(page.browserContextId != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, browser._connection.send('Target.disposeBrowserContext', { browserContextId: page.browserContextId })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, page.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.run = function (onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var browser, loginPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lunchBrowser()];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, this.login(browser)];
                    case 2:
                        loginPage = _a.sent();
                        // await this.postToPages(loginPage, onPageUploadedCallback);
                        if ((config_helper_1.ConfigHelper.getConfigValue('headless', false)) === true || config_helper_1.ConfigHelper.getConfigValue('close_browser')) {
                            // await browser.close();
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.postToPages = function (page, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var count, fromEmailFieldExists, housingTypeSelectorExists, isFurnishedSelectorExists, _a, _b, _c, inputUploadHandles, inputUploadHandle, filesToUpload, imageCount;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        count = 0;
                        return [4 /*yield*/, page.setDefaultNavigationTimeout(10000)];
                    case 1:
                        _d.sent();
                        // page.click('.selection-list li')[6]
                        return [4 /*yield*/, this.clickTickboxByIndex(page, 3)];
                    case 2:
                        // page.click('.selection-list li')[6]
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('button[type=submit]')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.click('button[type=submit]')];
                    case 4:
                        _d.sent();
                        // this.delay(2000);
                        return [4 /*yield*/, page.waitForSelector('.option-label')];
                    case 5:
                        // this.delay(2000);
                        _d.sent();
                        return [4 /*yield*/, this.clickTickboxByIndex(page, 3, '.option-label')];
                    case 6:
                        _d.sent();
                        // this.delay(2000);
                        // await Promise.all([
                        return [4 /*yield*/, page.waitForSelector('button[type=submit]')];
                    case 7:
                        // this.delay(2000);
                        // await Promise.all([
                        _d.sent();
                        return [4 /*yield*/, page.click('button[type=submit]')];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector("#PostingTitle")];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, this.threeClickType(page, "#PostingTitle", this.title)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, this.threeClickType(page, "#geographic_area", this.location)];
                    case 11:
                        _d.sent();
                        //await this.threeClickType(page,"#PostingBody",this.content);
                        return [4 /*yield*/, this.threeClickType(page, "input[name='price']", this.price)];
                    case 12:
                        //await this.threeClickType(page,"#PostingBody",this.content);
                        _d.sent();
                        return [4 /*yield*/, this.threeClickType(page, "input[name='surface_area']", this.surfaceArea)];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, page.$("input[name=FromEMail][type=text]")];
                    case 14:
                        fromEmailFieldExists = _d.sent();
                        if (!(fromEmailFieldExists !== null)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.threeClickType(page, "input[name=FromEMail][type=text]", this.credentials.username)];
                    case 15:
                        _d.sent();
                        _d.label = 16;
                    case 16: return [4 /*yield*/, page.$("select[name='housing_type']")];
                    case 17:
                        housingTypeSelectorExists = (_d.sent()) !== null ? true : false;
                        if (!(housingTypeSelectorExists === true)) return [3 /*break*/, 19];
                        return [4 /*yield*/, page.select("select[name='housing_type']", '2')];
                    case 18:
                        _d.sent();
                        _d.label = 19;
                    case 19: 
                    // await this.clickTickbox(page,'show my phone number',false);
                    // this.delay(500);
                    return [4 /*yield*/, page.click('input.show_phone_ok')];
                    case 20:
                        // await this.clickTickbox(page,'show my phone number',false);
                        // this.delay(500);
                        _d.sent();
                        return [4 /*yield*/, page.type("input[name='contact_phone']", this.phoneNumber)];
                    case 21:
                        _d.sent();
                        return [4 /*yield*/, page.type("input[name='contact_phone_extension']", this.phoneExtension)];
                    case 22:
                        _d.sent();
                        return [4 /*yield*/, page.$("input.is_furnished")];
                    case 23:
                        isFurnishedSelectorExists = (_d.sent()) !== null ? true : false;
                        if (!isFurnishedSelectorExists) return [3 /*break*/, 25];
                        return [4 /*yield*/, page.click('input.is_furnished')];
                    case 24:
                        _d.sent();
                        _d.label = 25;
                    case 25:
                        _b = (_a = Promise).all;
                        _c = [page.waitForNavigation({ waitUntil: 'load' })];
                        return [4 /*yield*/, page.click('button[type=submit]')];
                    case 26: 
                    // await this.clickTickbox(page,'furnished',false);
                    // await this.delay(500);
                    // await page.click('button[type=submit]');
                    // await this.delay(500);
                    return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _d.sent()
                            ])])];
                    case 27:
                        // await this.clickTickbox(page,'furnished',false);
                        // await this.delay(500);
                        // await page.click('button[type=submit]');
                        // await this.delay(500);
                        _d.sent();
                        console.log('wating for imgcount');
                        return [4 /*yield*/, page.waitForSelector('.imgcount')];
                    case 28:
                        _d.sent();
                        console.log('READY WITH: wating for imgcount');
                        // await page.waitForNavigation();
                        // let clickUpload = await page.waitForSelector('a.newupl');
                        // await clickUpload.click();
                        return [4 /*yield*/, page.waitForSelector('input[type=file]')];
                    case 29:
                        // await page.waitForNavigation();
                        // let clickUpload = await page.waitForSelector('a.newupl');
                        // await clickUpload.click();
                        _d.sent();
                        return [4 /*yield*/, page.$$('input[type=file]')];
                    case 30:
                        inputUploadHandles = _d.sent();
                        inputUploadHandle = inputUploadHandles[0];
                        filesToUpload = this.getImagesToPost();
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, __spread(filesToUpload))];
                    case 31:
                        _d.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 32:
                        imageCount = (_d.sent());
                        _d.label = 33;
                    case 33:
                        if (!(imageCount < filesToUpload.length)) return [3 /*break*/, 36];
                        return [4 /*yield*/, this.delay(500)];
                    case 34:
                        _d.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 35:
                        imageCount = (_d.sent());
                        console.log('wating image count');
                        return [3 /*break*/, 33];
                    case 36: return [4 /*yield*/, page.click('button[type=submit].done')];
                    case 37:
                        _d.sent();
                        if (!this.immediatelyPost) return [3 /*break*/, 40];
                        return [4 /*yield*/, page.waitForSelector("button[name='go']")];
                    case 38:
                        _d.sent();
                        return [4 /*yield*/, page.click("button[name='go']")];
                    case 39:
                        _d.sent();
                        _d.label = 40;
                    case 40: return [2 /*return*/, page];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.getImageCount = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var element, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.$('.imgcount')];
                    case 1:
                        element = _a.sent();
                        return [4 /*yield*/, page.evaluate(function (el) { return el.textContent; }, element)];
                    case 2:
                        value = _a.sent();
                        return [2 /*return*/, value];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.clickTickbox = function (page, selectionText, awaitNavigation) {
        if (awaitNavigation === void 0) { awaitNavigation = true; }
        return __awaiter(this, void 0, void 0, function () {
            var linkHandlers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.$x("//span[contains(text(), '" + selectionText + "')]")];
                    case 1:
                        linkHandlers = _a.sent();
                        if (!(linkHandlers.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, linkHandlers[0].click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Link not found");
                    case 4:
                        if (!awaitNavigation) return [3 /*break*/, 6];
                        return [4 /*yield*/, page.waitForNavigation()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, page];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.clickTickboxByIndex = function (page, selectionIndex, querySelector, awaitNavigation) {
        if (querySelector === void 0) { querySelector = ".selection-list>li>label>.right-side"; }
        if (awaitNavigation === void 0) { awaitNavigation = true; }
        return __awaiter(this, void 0, void 0, function () {
            var result, elements, _a, _b, _c, i, link, e_2_1;
            var e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // const linkHandlers = await page.$(querySelector);
                        console.log('start');
                        result = false;
                        return [4 /*yield*/, page.$$(querySelector)];
                    case 1:
                        elements = _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 8, 9, 10]);
                        _a = __values((elements.entries())), _b = _a.next();
                        _e.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 7];
                        _c = __read(_b.value, 2), i = _c[0], link = _c[1];
                        if (!(i == selectionIndex)) return [3 /*break*/, 5];
                        // console.log('Selected index' + selectionIndex, link);
                        return [4 /*yield*/, link.click()];
                    case 4:
                        // console.log('Selected index' + selectionIndex, link);
                        _e.sent();
                        result = true;
                        // await page.waitForNavigation({ waitUntil: 'load' });
                        return [3 /*break*/, 7];
                    case 5:
                        result = false;
                        _e.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (!result) return [3 /*break*/, 11];
                        return [2 /*return*/, true];
                    case 11: return [4 /*yield*/, this.delay(500)];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, this.clickTickboxByIndex(page, selectionIndex, querySelector, awaitNavigation)
                            // throw new Error("Link By Index: "+selectionIndex+". not found");
                        ];
                    case 13: return [2 /*return*/, _e.sent()
                        // throw new Error("Link By Index: "+selectionIndex+". not found");
                    ];
                    case 14: return [2 /*return*/, false];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.lunchBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                config = config_helper_1.ConfigHelper.getConfig();
                return [2 /*return*/, puppeteer.launch({
                        executablePath: config_helper_1.ConfigHelper.getConfigValue('chrome_executable_path'),
                        headless: config_helper_1.ConfigHelper.getConfigValue('headless', false),
                        defaultViewport: null,
                        args: ['--start-maximized', "--disable-notifications"],
                        userDataDir: this.getPathInUserData(this.chromeSessionPath)
                    })];
            });
        });
    };
    return LivinginsiderPoster;
}(channel_base_1.ChannelBase));
exports.LivinginsiderPoster = LivinginsiderPoster;
//# sourceMappingURL=livinginsider.group.poster.js.map