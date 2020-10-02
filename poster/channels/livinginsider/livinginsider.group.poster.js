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
exports.LivinginsiderPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var LivinginsiderPoster = /** @class */ (function (_super) {
    __extends(LivinginsiderPoster, _super);
    function LivinginsiderPoster(credentials, imagesToPost, thaiContent, englishContent, title, location, price, surfaceArea, phoneNumber, phoneExtension, immediatelyPost, beds, baths) {
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
        _this.beds = beds;
        _this.baths = baths;
        _this.channelUrl = 'https://livinginsider.com/en';
        _this.channelCreatePostUrl = 'https://www.livinginsider.com/living_buysell.php';
        _this.channelLogoutUrl = 'https://www.livinginsider.com/logout.php';
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
            var loginPage, _a, username, password, loggedInUserSelector, e_1, closeAdModalSelector, _b, _c, _d, e_2, openLoginSelector, _e, _f, _g, loginUsernameSelector;
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
                        _h.sent();
                        loggedInUserSelector = 'ul.dropdown-menu.dropdown-menu-right.user-link>li.dropdown>a.dropdown-toggle';
                        return [4 /*yield*/, this.delay(1000)];
                    case 4:
                        _h.sent();
                        _h.label = 5;
                    case 5:
                        _h.trys.push([5, 10, , 11]);
                        return [4 /*yield*/, loginPage.waitForSelector(loggedInUserSelector, { timeout: 5000 })];
                    case 6:
                        if (!((_h.sent()) != null)) return [3 /*break*/, 9];
                        return [4 /*yield*/, loginPage.goto(this.channelLogoutUrl, { waitUntil: 'load', timeout: 0 })];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'load', timeout: 0 })];
                    case 8:
                        _h.sent();
                        _h.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_1 = _h.sent();
                        console.log('Exception raised, user is not logged in');
                        return [3 /*break*/, 11];
                    case 11:
                        closeAdModalSelector = '.modal-dialog>.modal-content>.modal-body>a.hideBanner[data-dismiss="modal"][onclick="ActiveBanner.closeActiveBanner();"]';
                        return [4 /*yield*/, this.delay(1000)];
                    case 12:
                        _h.sent();
                        _h.label = 13;
                    case 13:
                        _h.trys.push([13, 16, , 17]);
                        _c = (_b = Promise).all;
                        _d = [loginPage.waitForSelector(closeAdModalSelector)];
                        return [4 /*yield*/, loginPage.click(closeAdModalSelector)];
                    case 14: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _h.sent(),
                                this.delay(500)
                            ])])];
                    case 15:
                        _h.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        e_2 = _h.sent();
                        console.log('Exception raised, no ad modal popup to close found');
                        return [3 /*break*/, 17];
                    case 17:
                        openLoginSelector = 'li#none_login_zone>a[data-target="#loginModal"]';
                        _f = (_e = Promise).all;
                        _g = [loginPage.waitForSelector(openLoginSelector)];
                        return [4 /*yield*/, loginPage.click(openLoginSelector)];
                    case 18: return [4 /*yield*/, _f.apply(_e, [_g.concat([
                                _h.sent(),
                                this.delay(500)
                            ])])];
                    case 19:
                        _h.sent();
                        loginUsernameSelector = '#login_username';
                        return [4 /*yield*/, loginPage.waitForSelector('#login_username')];
                    case 20:
                        _h.sent();
                        return [4 /*yield*/, loginPage.type(loginUsernameSelector, username)];
                    case 21:
                        _h.sent();
                        return [4 /*yield*/, loginPage.type('#password', password)];
                    case 22:
                        _h.sent();
                        return [4 /*yield*/, loginPage.click('#btn-signin')];
                    case 23:
                        _h.sent();
                        return [4 /*yield*/, loginPage.waitForNavigation()];
                    case 24:
                        _h.sent();
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
                        return [4 /*yield*/, this.postToPages(loginPage, onPageUploadedCallback)];
                    case 3:
                        _a.sent();
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
            var count, closePrivacyModalSelector, _a, _b, _c, e_3, englishLanguageSelector, select2Elements;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        count = 0;
                        return [4 /*yield*/, page.setDefaultNavigationTimeout(10000)];
                    case 1:
                        _d.sent();
                        //navigate to create post page
                        return [4 /*yield*/, page.goto(this.channelCreatePostUrl, { waitUntil: 'load', timeout: 0 })];
                    case 2:
                        //navigate to create post page
                        _d.sent();
                        closePrivacyModalSelector = 'div.col-md-1.col-sm-1.accetpPrivacy>a[href="javascript:void(0)"]';
                        return [4 /*yield*/, this.delay(1000)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 7, , 8]);
                        _b = (_a = Promise).all;
                        _c = [page.waitForSelector(closePrivacyModalSelector)];
                        return [4 /*yield*/, page.click(closePrivacyModalSelector)];
                    case 5: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _d.sent(),
                                this.delay(1000)
                            ])])];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_3 = _d.sent();
                        console.log('Exception raised, privacy modal is not visible');
                        return [3 /*break*/, 8];
                    case 8: 
                    /**
                     * CREATE POST - STEP ONE
                     * TITLE
                    */
                    //select Agent as status
                    return [4 /*yield*/, page.click('#web_post_from2')];
                    case 9:
                        /**
                         * CREATE POST - STEP ONE
                         * TITLE
                        */
                        //select Agent as status
                        _d.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 10:
                        _d.sent();
                        //select Condo as property type
                        return [4 /*yield*/, page.waitForSelector('#select2-buildingList-container')];
                    case 11:
                        //select Condo as property type
                        _d.sent();
                        return [4 /*yield*/, page.click('#select2-buildingList-container')];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 14:
                        _d.sent();
                        //select For Sale as post type
                        return [4 /*yield*/, page.click('#web_post_type1')];
                    case 15:
                        //select For Sale as post type
                        _d.sent();
                        //enter project name (Unknown project)
                        return [4 /*yield*/, page.click('#select2-web_project_id-container')];
                    case 16:
                        //enter project name (Unknown project)
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('.select2-search__field')];
                    case 17:
                        _d.sent();
                        return [4 /*yield*/, page.type('.select2-search__field', 'Unknown project')];
                    case 18:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 19:
                        _d.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 20:
                        _d.sent();
                        return [4 /*yield*/, this.delay(4000)];
                    case 21:
                        _d.sent();
                        //enter zone name (Pattaya)
                        return [4 /*yield*/, page.waitForSelector('#select2-web_zone_id-container')];
                    case 22:
                        //enter zone name (Pattaya)
                        _d.sent();
                        return [4 /*yield*/, page.click('#select2-web_zone_id-container')];
                    case 23:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('.select2-search__field')];
                    case 24:
                        _d.sent();
                        return [4 /*yield*/, page.type('.select2-search__field', 'Pattaya')];
                    case 25:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 26:
                        _d.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 27:
                        _d.sent();
                        //enter title (TH)
                        return [4 /*yield*/, page.click('#web_title')];
                    case 28:
                        //enter title (TH)
                        _d.sent();
                        return [4 /*yield*/, page.type('#web_title', this.title)];
                    case 29:
                        _d.sent();
                        //enter description (TH) 
                        return [4 /*yield*/, page.click('#web_description')];
                    case 30:
                        //enter description (TH) 
                        _d.sent();
                        return [4 /*yield*/, page.type('#web_description', this.englishContent)];
                    case 31:
                        _d.sent(); //TODO: need to use thai in the future
                        englishLanguageSelector = 'div.col-md-12.col-sm-12.title-des-lang>ul.nav.nav-tabs>li>a[href="#en"]';
                        return [4 /*yield*/, page.click(englishLanguageSelector)];
                    case 32:
                        _d.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 33:
                        _d.sent();
                        return [4 /*yield*/, page.click('#web_title_en')];
                    case 34:
                        _d.sent();
                        return [4 /*yield*/, page.type('#web_title_en', this.title)];
                    case 35:
                        _d.sent();
                        //enter description (EN)
                        return [4 /*yield*/, page.click('#web_description_en')];
                    case 36:
                        //enter description (EN)
                        _d.sent();
                        return [4 /*yield*/, page.type('#web_description_en', this.englishContent)];
                    case 37:
                        _d.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 38:
                        _d.sent();
                        //click on next step
                        // await page.waitForSelector('button[type=submit]');
                        return [4 /*yield*/, Promise.all([
                                page.click('button[type=submit]'),
                                page.waitForNavigation()
                            ])];
                    case 39:
                        //click on next step
                        // await page.waitForSelector('button[type=submit]');
                        _d.sent();
                        return [4 /*yield*/, page.$$('.select2.select2-container.select2-container')];
                    case 40:
                        select2Elements = _d.sent();
                        return [4 /*yield*/, select2Elements[0].click()];
                    case 41:
                        _d.sent();
                        return [4 /*yield*/, page.click('#select2-web_room-results>li:nth-child(' + (this.baths + 2) + ')')
                            //select baths
                        ];
                    case 42:
                        _d.sent();
                        //select baths
                        return [4 /*yield*/, select2Elements[1].click()];
                    case 43:
                        //select baths
                        _d.sent();
                        return [4 /*yield*/, page.click('#select2-web_bathroom-results>li:nth-child(' + (this.baths + 1) + ')')];
                    case 44:
                        _d.sent();
                        return [2 /*return*/, page];
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