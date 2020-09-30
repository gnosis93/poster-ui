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
exports.BathsoldPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var BathsoldPoster = /** @class */ (function (_super) {
    __extends(BathsoldPoster, _super);
    function BathsoldPoster(credentials, imagesToPost, content, title, location, price, surfaceArea, phoneNumber, phoneExtension, immediatelyPost) {
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
        _this.immediatelyPost = immediatelyPost;
        _this.channelUrl = 'https://www.bahtsold.com/';
        _this.postADUrl = 'https://www.bahtsold.com/members/select_ad_category';
        if (!credentials || !credentials.username || !credentials.password) {
            throw "Invalid Credentials Object given to CraigslistGroupPoster";
        }
        return _this;
    }
    BathsoldPoster.prototype.getImagesToPost = function () {
        return this.imagesToPost.filter(function (i) { return i.selected == true; }).map(function (i) { return i.imageURL; });
    };
    BathsoldPoster.prototype.getCredentials = function () {
        return this.credentials;
    };
    BathsoldPoster.prototype.login = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var loginPage, _a, username, password, loginBTN;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getActivePage(browser, 1200)];
                    case 1:
                        loginPage = _b.sent();
                        _a = this.getCredentials(), username = _a.username, password = _a.password;
                        // await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'load' })];
                    case 2:
                        // await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        _b.sent();
                        loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
                        return [4 /*yield*/, loginPage.waitForSelector(loginBTN)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, loginPage.click(loginBTN)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#login-username', username)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, loginPage.type('#login-password', password)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, loginPage.click('.btn.btn-md.btn-blue.block-element')];
                    case 8:
                        _b.sent();
                        // await loginPage.waitForNavigation();
                        return [2 /*return*/, loginPage];
                }
            });
        });
    };
    BathsoldPoster.prototype.run = function (onPageUploadedCallback) {
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
                        return [4 /*yield*/, this.postAD(loginPage, onPageUploadedCallback)];
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
    BathsoldPoster.prototype.postAD = function (page, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var selectRealEstateCategorySelector, selectCondosCategorySelector, selectFreeAdSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goto(this.postADUrl, { waitUntil: 'load' })];
                    case 1:
                        _a.sent();
                        selectRealEstateCategorySelector = 'li[data-price-30="490"]';
                        return [4 /*yield*/, page.waitForSelector(selectRealEstateCategorySelector)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.click(selectRealEstateCategorySelector)];
                    case 3:
                        _a.sent();
                        selectCondosCategorySelector = 'li[data-id="175"]';
                        return [4 /*yield*/, page.waitForSelector(selectCondosCategorySelector)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.click(selectCondosCategorySelector)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.click('button.submit-category')];
                    case 7:
                        _a.sent();
                        selectFreeAdSelector = 'div[data-type="0"]>div.price-table-footer>a.btn-chosen';
                        return [4 /*yield*/, page.waitForSelector(selectFreeAdSelector)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.click(selectCondosCategorySelector)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BathsoldPoster.prototype.lunchBrowser = function () {
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
    return BathsoldPoster;
}(channel_base_1.ChannelBase));
exports.BathsoldPoster = BathsoldPoster;
//# sourceMappingURL=bathsold.poster.js.map