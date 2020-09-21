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
exports.CraigslistPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var CraigslistPoster = /** @class */ (function (_super) {
    __extends(CraigslistPoster, _super);
    function CraigslistPoster(credentials, imagesToPost, content, title, location, price, surfaceArea, phoneNumber, phoneExtension) {
        if (title === void 0) { title = 'Test Title'; }
        if (location === void 0) { location = 'Test Location'; }
        if (price === void 0) { price = 20000; }
        if (surfaceArea === void 0) { surfaceArea = 23; }
        if (phoneNumber === void 0) { phoneNumber = '325 2325 2322'; }
        if (phoneExtension === void 0) { phoneExtension = '+356'; }
        var _this = _super.call(this) || this;
        _this.credentials = credentials;
        _this.imagesToPost = imagesToPost;
        _this.content = content;
        _this.title = title;
        _this.location = location;
        _this.price = price;
        _this.surfaceArea = surfaceArea;
        _this.phoneNumber = phoneNumber;
        _this.phoneExtension = phoneExtension;
        _this.channelUrl = 'https://craigslist.com/';
        _this.channelLoginUrl = 'https://accounts.craigslist.org/login';
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to FacebookGroupPoster";
        }
        return _this;
    }
    CraigslistPoster.prototype.getImagesToPost = function () {
        return this.imagesToPost.filter(function (i) { return i.selected == true; }).map(function (i) { return i.imageURL; });
    };
    CraigslistPoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    CraigslistPoster.prototype.login = function (browser) {
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
                        return [4 /*yield*/, loginPage.type('#inputEmailHandle', username)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#inputPassword', password)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.click('#login')];
                    case 6:
                        _b.sent();
                        // await loginPage.waitForNavigation();
                        return [2 /*return*/, loginPage];
                }
            });
        });
    };
    CraigslistPoster.prototype.run = function (onPageUploadedCallback) {
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
    CraigslistPoster.prototype.postToPages = function (page, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var count, inputUploadHandles, inputUploadHandle, filesToUpload, imageCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = 0;
                        // let page = (await browser.newPage())
                        return [4 /*yield*/, page.goto('https://post.craigslist.org/c/bkk', {
                                waitUntil: "networkidle2",
                                timeout: 0
                            })];
                    case 1:
                        // let page = (await browser.newPage())
                        _a.sent();
                        return [4 /*yield*/, page.setDefaultNavigationTimeout(0)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickTickbox(page, 'housing offered')];
                    case 3:
                        // page.click('.selection-list li')[6]
                        page = _a.sent();
                        return [4 /*yield*/, this.clickTickbox(page, 'real estate - by broker')];
                    case 4:
                        page = _a.sent();
                        return [4 /*yield*/, page.click('button[type=submit]')];
                    case 5:
                        _a.sent();
                        this.delay(500);
                        // await page.waitForNavigation(
                        //     {
                        //         waitUntil: "networkidle2",
                        //         timeout: 0
                        //     }
                        // );
                        return [4 /*yield*/, page.type("#PostingTitle", this.title)];
                    case 6:
                        // await page.waitForNavigation(
                        //     {
                        //         waitUntil: "networkidle2",
                        //         timeout: 0
                        //     }
                        // );
                        _a.sent();
                        return [4 /*yield*/, page.type("#geographic_area", this.location)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.type("#PostingBody", this.content)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.type("input[name='price']", String(this.price))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.type("input[name='surface_area']", String(this.surfaceArea))];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.select("select[name='housing_type']", '2')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.clickTickbox(page, 'show my phone number', false)];
                    case 12:
                        _a.sent();
                        this.delay(500);
                        return [4 /*yield*/, page.type("input[name='contact_phone']", this.phoneNumber)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, page.type("input[name='contact_phone_extension']", this.phoneExtension)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.clickTickbox(page, 'furnished', false)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, page.click('button[type=submit]')];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.imgcount')
                            // await page.waitForNavigation();
                        ];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, page.$$('input[type=file]')];
                    case 20:
                        inputUploadHandles = _a.sent();
                        inputUploadHandle = inputUploadHandles[0];
                        filesToUpload = this.getImagesToPost();
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, filesToUpload)];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 22:
                        imageCount = (_a.sent());
                        _a.label = 23;
                    case 23:
                        if (!(imageCount < filesToUpload.length)) return [3 /*break*/, 26];
                        return [4 /*yield*/, this.delay(100)];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, this.getImageCount(page)];
                    case 25:
                        imageCount = (_a.sent());
                        return [3 /*break*/, 23];
                    case 26: return [4 /*yield*/, page.click('button[type=submit].done')];
                    case 27:
                        _a.sent();
                        return [2 /*return*/, page];
                }
            });
        });
    };
    CraigslistPoster.prototype.getImageCount = function (page) {
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
    CraigslistPoster.prototype.clickTickbox = function (page, selectionText, awaitNavigation) {
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
    CraigslistPoster.prototype.lunchBrowser = function () {
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
    return CraigslistPoster;
}(channel_base_1.ChannelBase));
exports.CraigslistPoster = CraigslistPoster;
//# sourceMappingURL=craigslist.group.poster.js.map