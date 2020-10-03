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
            var loginPage, _a, username, password, closeAdModalSelector, _b, _c, _d, e_1, openLoginSelector, e_2, _e, _f, loginUsernameSelector, loginBtnSelector;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, browser.newPage()];
                    case 1:
                        loginPage = _g.sent();
                        _a = this.getCredentials(), username = _a.username, password = _a.password;
                        return [4 /*yield*/, loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'load', timeout: 0 })];
                    case 3:
                        _g.sent();
                        closeAdModalSelector = '.modal-dialog>.modal-content>.modal-body>a.hideBanner[data-dismiss="modal"][onclick="ActiveBanner.closeActiveBanner();"]';
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, 7, , 8]);
                        _c = (_b = Promise).all;
                        _d = [loginPage.waitForSelector(closeAdModalSelector)];
                        return [4 /*yield*/, loginPage.click(closeAdModalSelector)];
                    case 5: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _g.sent(),
                                this.delay(1000)
                            ])])];
                    case 6:
                        _g.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _g.sent();
                        console.log('Exception raised, no ad modal popup to close found');
                        return [3 /*break*/, 8];
                    case 8:
                        openLoginSelector = 'li#none_login_zone>a[data-target="#loginModal"]';
                        _g.label = 9;
                    case 9:
                        _g.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, loginPage.waitForSelector(openLoginSelector, { timeout: 500 })];
                    case 10:
                        _g.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        e_2 = _g.sent();
                        console.log('already logged in, skipping login');
                        return [2 /*return*/, loginPage];
                    case 12:
                        _f = (_e = Promise).all;
                        return [4 /*yield*/, loginPage.click(openLoginSelector)];
                    case 13: return [4 /*yield*/, _f.apply(_e, [[
                                _g.sent(),
                                this.delay(500)
                            ]])];
                    case 14:
                        _g.sent();
                        loginUsernameSelector = '#login_username';
                        return [4 /*yield*/, loginPage.waitForSelector('#login_username')];
                    case 15:
                        _g.sent();
                        return [4 /*yield*/, loginPage.type(loginUsernameSelector, username)];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, loginPage.waitForSelector('#password')];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, loginPage.type('#password', password)];
                    case 18:
                        _g.sent();
                        loginBtnSelector = '#btn-signin';
                        return [4 /*yield*/, loginPage.waitForSelector(loginBtnSelector)];
                    case 19:
                        _g.sent();
                        return [4 /*yield*/, loginPage.click(loginBtnSelector)];
                    case 20:
                        _g.sent();
                        return [4 /*yield*/, loginPage.waitForNavigation()];
                    case 21:
                        _g.sent();
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
            var count, closePrivacyModalSelector, _a, _b, _c, e_3, englishLanguageSelector, btnNextSelector, _d, _e, _f, select2Elements, imagesInputSelector, inputUploadHandles, inputUploadHandle, filesToUpload, imageCount, acceptCoAgentSelector, savePublishSelector, saveDraftSelector;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        count = 0;
                        return [4 /*yield*/, page.setDefaultNavigationTimeout(10000)];
                    case 1:
                        _g.sent();
                        //navigate to create post page
                        return [4 /*yield*/, page.goto(this.channelCreatePostUrl, { waitUntil: 'load', timeout: 0 })];
                    case 2:
                        //navigate to create post page
                        _g.sent();
                        closePrivacyModalSelector = 'div.col-md-1.col-sm-1.accetpPrivacy>a[href="javascript:void(0)"]';
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 6, , 7]);
                        _b = (_a = Promise).all;
                        _c = [page.waitForSelector(closePrivacyModalSelector)];
                        return [4 /*yield*/, page.click(closePrivacyModalSelector)];
                    case 4: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _g.sent(),
                                this.delay(200)
                            ])])];
                    case 5:
                        _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_3 = _g.sent();
                        console.log('Exception raised, privacy modal is not visible');
                        return [3 /*break*/, 7];
                    case 7: 
                    /**
                     * CREATE POST - STEP ONE
                     * TITLE
                    */
                    //select Agent as status
                    return [4 /*yield*/, page.click('#web_post_from2')];
                    case 8:
                        /**
                         * CREATE POST - STEP ONE
                         * TITLE
                        */
                        //select Agent as status
                        _g.sent();
                        //select Condo as property type
                        return [4 /*yield*/, page.waitForSelector('#select2-buildingList-container')];
                    case 9:
                        //select Condo as property type
                        _g.sent();
                        return [4 /*yield*/, page.click('#select2-buildingList-container')];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 11:
                        _g.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 12:
                        _g.sent();
                        //select For Sale as post type
                        return [4 /*yield*/, page.click('#web_post_type1')];
                    case 13:
                        //select For Sale as post type
                        _g.sent();
                        //enter project name (Unknown project)
                        return [4 /*yield*/, page.click('#select2-web_project_id-container')];
                    case 14:
                        //enter project name (Unknown project)
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector('.select2-search__field')];
                    case 15:
                        _g.sent();
                        return [4 /*yield*/, page.type('.select2-search__field', 'Unknown project')];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 18:
                        _g.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 19:
                        _g.sent();
                        //enter zone name (Pattaya)
                        return [4 /*yield*/, page.waitForSelector('#select2-web_zone_id-container')];
                    case 20:
                        //enter zone name (Pattaya)
                        _g.sent();
                        return [4 /*yield*/, page.click('#select2-web_zone_id-container')];
                    case 21:
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector('.select2-search__field')];
                    case 22:
                        _g.sent();
                        return [4 /*yield*/, page.type('.select2-search__field', 'Pattaya')];
                    case 23:
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector('li.select2-results__option.select2-results__option--highlighted')];
                    case 24:
                        _g.sent();
                        return [4 /*yield*/, page.click('li.select2-results__option.select2-results__option--highlighted')];
                    case 25:
                        _g.sent();
                        //enter title (TH)
                        return [4 /*yield*/, page.click('#web_title')];
                    case 26:
                        //enter title (TH)
                        _g.sent();
                        return [4 /*yield*/, page.type('#web_title', this.title)];
                    case 27:
                        _g.sent();
                        //enter description (TH) 
                        return [4 /*yield*/, page.click('#web_description')];
                    case 28:
                        //enter description (TH) 
                        _g.sent();
                        return [4 /*yield*/, page.type('#web_description', this.englishContent)];
                    case 29:
                        _g.sent(); //TODO: need to use thai in the future
                        englishLanguageSelector = 'div.col-md-12.col-sm-12.title-des-lang>ul.nav.nav-tabs>li>a[href="#en"]';
                        return [4 /*yield*/, page.click(englishLanguageSelector)];
                    case 30:
                        _g.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 31:
                        _g.sent();
                        return [4 /*yield*/, page.click('#web_title_en')];
                    case 32:
                        _g.sent();
                        return [4 /*yield*/, page.type('#web_title_en', this.title)];
                    case 33:
                        _g.sent();
                        //enter description (EN)
                        return [4 /*yield*/, page.click('#web_description_en')];
                    case 34:
                        //enter description (EN)
                        _g.sent();
                        return [4 /*yield*/, page.type('#web_description_en', this.englishContent)];
                    case 35:
                        _g.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 36:
                        _g.sent();
                        btnNextSelector = 'button[type=submit].btn.btn-default-out.circle.flo-right';
                        _e = (_d = Promise).all;
                        return [4 /*yield*/, page.waitForSelector(btnNextSelector)];
                    case 37:
                        _f = [
                            _g.sent()
                        ];
                        return [4 /*yield*/, page.click(btnNextSelector)];
                    case 38: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                                _g.sent(),
                                page.waitForNavigation()
                            ])])];
                    case 39:
                        _g.sent();
                        return [4 /*yield*/, page.$$('.select2.select2-container.select2-container')];
                    case 40:
                        select2Elements = _g.sent();
                        return [4 /*yield*/, select2Elements[0].click()];
                    case 41:
                        _g.sent();
                        return [4 /*yield*/, page.click('#select2-web_room-results>li:nth-child(' + (this.baths + 2) + ')')
                            //select baths
                        ];
                    case 42:
                        _g.sent();
                        //select baths
                        return [4 /*yield*/, select2Elements[1].click()];
                    case 43:
                        //select baths
                        _g.sent();
                        return [4 /*yield*/, page.click('#select2-web_bathroom-results>li:nth-child(' + (this.baths + 1) + ')')];
                    case 44:
                        _g.sent();
                        //select level
                        return [4 /*yield*/, select2Elements[2].click()];
                    case 45:
                        //select level
                        _g.sent();
                        return [4 /*yield*/, page.click('#select2-web_floor-results>li:nth-child(' + (7) + ')')];
                    case 46:
                        _g.sent();
                        // enter size
                        return [4 /*yield*/, page.type('#web_area_size', this.surfaceArea)
                            //enter price
                        ];
                    case 47:
                        // enter size
                        _g.sent();
                        //enter price
                        return [4 /*yield*/, page.type('#web_price', this.price)];
                    case 48:
                        //enter price
                        _g.sent();
                        imagesInputSelector = 'input[type=file][multiple]';
                        return [4 /*yield*/, page.waitForSelector(imagesInputSelector)];
                    case 49:
                        _g.sent();
                        return [4 /*yield*/, page.$$(imagesInputSelector)];
                    case 50:
                        inputUploadHandles = _g.sent();
                        inputUploadHandle = inputUploadHandles[0];
                        filesToUpload = this.getImagesToPost();
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, __spread(filesToUpload))];
                    case 51:
                        _g.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 52:
                        imageCount = (_g.sent());
                        _g.label = 53;
                    case 53:
                        if (!(imageCount < filesToUpload.length)) return [3 /*break*/, 56];
                        return [4 /*yield*/, this.delay(500)];
                    case 54:
                        _g.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 55:
                        imageCount = (_g.sent());
                        console.log('waiting image count');
                        return [3 /*break*/, 53];
                    case 56:
                        page.click('button[onclick="acceptModal();"]');
                        acceptCoAgentSelector = '#post_data>div.btn-area>button';
                        return [4 /*yield*/, this.delay(500)];
                    case 57:
                        _g.sent();
                        return [4 /*yield*/, page.waitForSelector(acceptCoAgentSelector)];
                    case 58:
                        _g.sent();
                        return [4 /*yield*/, page.click(acceptCoAgentSelector)];
                    case 59:
                        _g.sent();
                        return [4 /*yield*/, page.waitForNavigation()];
                    case 60:
                        _g.sent();
                        savePublishSelector = '#save_publish';
                        return [4 /*yield*/, page.waitForSelector(savePublishSelector)];
                    case 61:
                        _g.sent();
                        if (!this.immediatelyPost) return [3 /*break*/, 63];
                        return [4 /*yield*/, page.click(savePublishSelector)];
                    case 62:
                        _g.sent();
                        return [3 /*break*/, 66];
                    case 63:
                        saveDraftSelector = '#save_draft';
                        return [4 /*yield*/, page.waitForSelector(saveDraftSelector)];
                    case 64:
                        _g.sent();
                        return [4 /*yield*/, page.click(saveDraftSelector)];
                    case 65:
                        _g.sent();
                        _g.label = 66;
                    case 66: return [2 /*return*/, page];
                }
            });
        });
    };
    LivinginsiderPoster.prototype.getImageCount = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var element, value, valueStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.$('#upload_complete')];
                    case 1:
                        element = _a.sent();
                        return [4 /*yield*/, page.evaluate(function (el) { return el.textContent; }, element)];
                    case 2:
                        value = _a.sent();
                        valueStr = String(value);
                        valueStr = valueStr.replace('Upload complete :', '').trim();
                        return [2 /*return*/, Number(valueStr)];
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