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
exports.BathsoldPoster = void 0;
var puppeteer = require("puppeteer");
var channel_base_1 = require("../channel.base");
var config_helper_1 = require("../../helpers/config.helper");
var BathsoldPoster = /** @class */ (function (_super) {
    __extends(BathsoldPoster, _super);
    function BathsoldPoster(credentials, imagesToPost, content, title, location, price, surfaceArea, phoneNumber, phoneExtension, immediatelyPost, numberOfBeds, numberOfBaths) {
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
        _this.numberOfBeds = numberOfBeds;
        _this.numberOfBaths = numberOfBaths;
        _this.channelUrl = 'https://www.bahtsold.com/';
        _this.postADUrl = 'https://www.bahtsold.com/members/select_ad_category';
        _this.maxLoginAttempts = 10;
        _this.loginAttemptsCount = 0;
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
            var loginPage, _a, username, password, loginBTN, _b, _c, _d, loginUsernameSelector, _e, _f, _g, loginBTNSelector, _h, _j, _k, loginBTNCount;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, this.getActivePage(browser, 1200)];
                    case 1:
                        loginPage = _l.sent();
                        _a = this.getCredentials(), username = _a.username, password = _a.password;
                        return [4 /*yield*/, this.delay(500)];
                    case 2:
                        _l.sent();
                        loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
                        _c = (_b = Promise).all;
                        return [4 /*yield*/, loginPage.goto(this.channelUrl, { waitUntil: 'load' })];
                    case 3:
                        _d = [
                            _l.sent(),
                            loginPage.waitForSelector(loginBTN)
                        ];
                        return [4 /*yield*/, loginPage.click(loginBTN)];
                    case 4: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _l.sent()
                            ])])];
                    case 5:
                        _l.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 6:
                        _l.sent();
                        loginUsernameSelector = '#login-username';
                        _f = (_e = Promise).all;
                        _g = [loginPage.waitForSelector(loginUsernameSelector)];
                        return [4 /*yield*/, loginPage.type(loginUsernameSelector, username)];
                    case 7: return [4 /*yield*/, _f.apply(_e, [_g.concat([
                                _l.sent()
                            ])])];
                    case 8:
                        _l.sent();
                        return [4 /*yield*/, Promise.all([
                                this.delay(200),
                                loginPage.type('#login-password', password)
                            ])];
                    case 9:
                        _l.sent();
                        loginBTNSelector = 'button.btn.btn-md.btn-blue.block-element';
                        _j = (_h = Promise).all;
                        _k = [loginPage.waitForSelector(loginBTNSelector)];
                        return [4 /*yield*/, loginPage.click(loginBTNSelector)];
                    case 10: return [4 /*yield*/, _j.apply(_h, [_k.concat([
                                _l.sent()
                            ])])];
                    case 11:
                        _l.sent();
                        return [4 /*yield*/, loginPage.waitForSelector('.app-logo')
                            // let loginBTN = 'a[href="#signInModal"].btn-placead.modal-trigger';
                        ];
                    case 12:
                        _l.sent();
                        return [4 /*yield*/, loginPage.$$(loginBTN)];
                    case 13:
                        loginBTNCount = (_l.sent()).length;
                        if (!(loginBTNCount > 0)) return [3 /*break*/, 16];
                        this.loginAttemptsCount++;
                        if (!(this.loginAttemptsCount > this.maxLoginAttempts)) return [3 /*break*/, 14];
                        console.log('Login Failed, max login attempts reached!!! Count: ' + this.loginAttemptsCount);
                        return [2 /*return*/, loginPage];
                    case 14:
                        console.log('Login Failed, reattempting login recursively. Count: ' + this.loginAttemptsCount);
                        return [4 /*yield*/, this.login(browser)];
                    case 15: return [2 /*return*/, (_l.sent())];
                    case 16: return [2 /*return*/, loginPage];
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
                        return [4 /*yield*/, this.delay(500)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.login(browser)];
                    case 3:
                        loginPage = _a.sent();
                        return [4 /*yield*/, this.postAD(loginPage, onPageUploadedCallback)];
                    case 4:
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
            var selectRealEstateCategorySelector, selectCondosCategorySelector, selectFreeAdSelector, continueBtnSelector, isAgentCheckBoxSelector, condoPropertyTypeSelector, numberOfBathsSelector, numberOfBedsSelector, fullyFurnishedOptionSelector, imageInputSelector, inputUploadHandles, inputUploadHandle, filesToUpload, removeImageBtns, removeImageBtns_1, removeImageBtns_1_1, removeImageBtn, e_1_1, filesToUploadLimited, count, filesToUpload_1, filesToUpload_1_1, file, provinceSelector, pattayaCentralOption, submitButtonSelector;
            var e_1, _a, e_2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto(this.postADUrl, { waitUntil: 'networkidle2', timeout: 15000 })];
                    case 1:
                        _c.sent();
                        selectRealEstateCategorySelector = 'li[data-price-30="490"]';
                        return [4 /*yield*/, page.waitForSelector(selectRealEstateCategorySelector)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.click(selectRealEstateCategorySelector)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 4:
                        _c.sent();
                        selectCondosCategorySelector = 'li[data-id="175"]';
                        return [4 /*yield*/, page.waitForSelector(selectCondosCategorySelector)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.click(selectCondosCategorySelector)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.click('button.submit-category')];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 9:
                        _c.sent();
                        selectFreeAdSelector = 'div[data-type="0"]>div.price-table-footer>a.btn-chosen';
                        return [4 /*yield*/, page.waitForSelector(selectFreeAdSelector)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, page.click(selectFreeAdSelector)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 12:
                        _c.sent();
                        continueBtnSelector = '.btn.btn-blue.btn-sm.submit-category';
                        return [4 /*yield*/, page.waitForSelector(continueBtnSelector)];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, page.click(continueBtnSelector)];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 15:
                        _c.sent();
                        isAgentCheckBoxSelector = 'label[for="is_owner_0"]';
                        return [4 /*yield*/, page.waitForSelector(isAgentCheckBoxSelector)];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, page.click(isAgentCheckBoxSelector)];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, page.type('#ad_title_en', this.title)];
                    case 18:
                        _c.sent();
                        //select condo type
                        return [4 /*yield*/, page.click('div.property_type')];
                    case 19:
                        //select condo type
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 20:
                        _c.sent();
                        condoPropertyTypeSelector = 'label[for=property_type_2272]';
                        return [4 /*yield*/, page.waitForSelector(condoPropertyTypeSelector)];
                    case 21:
                        _c.sent();
                        return [4 /*yield*/, page.click(condoPropertyTypeSelector)];
                    case 22:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 23:
                        _c.sent();
                        //set number of baths
                        return [4 /*yield*/, page.click('div.number_of_bath')];
                    case 24:
                        //set number of baths
                        _c.sent();
                        numberOfBathsSelector = 'label[for="number_of_bath_' + this.numberOfBaths + '"]';
                        if (this.numberOfBaths > 19) {
                            numberOfBathsSelector = 'label[for="number_of_bath_20"]';
                        }
                        return [4 /*yield*/, page.waitForSelector(numberOfBathsSelector)];
                    case 25:
                        _c.sent();
                        return [4 /*yield*/, page.click(numberOfBathsSelector)];
                    case 26:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 27:
                        _c.sent();
                        //set number of beds
                        return [4 /*yield*/, page.click('div.number_of_bed')];
                    case 28:
                        //set number of beds
                        _c.sent();
                        numberOfBedsSelector = 'label[for="number_of_bed_' + this.numberOfBaths + '"]';
                        if (this.numberOfBaths > 19) {
                            numberOfBedsSelector = 'label[for="number_of_bed_20"]';
                        }
                        return [4 /*yield*/, page.waitForSelector(numberOfBedsSelector)];
                    case 29:
                        _c.sent();
                        return [4 /*yield*/, page.click(numberOfBedsSelector)];
                    case 30:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 31:
                        _c.sent();
                        //furnished level
                        return [4 /*yield*/, page.click('div.furnished')];
                    case 32:
                        //furnished level
                        _c.sent();
                        fullyFurnishedOptionSelector = 'label[for="furnished_2280"]';
                        return [4 /*yield*/, page.waitForSelector(fullyFurnishedOptionSelector)];
                    case 33:
                        _c.sent();
                        return [4 /*yield*/, page.click(fullyFurnishedOptionSelector)];
                    case 34:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 35:
                        _c.sent();
                        //property size
                        return [4 /*yield*/, page.type('#property_size', this.surfaceArea)];
                    case 36:
                        //property size
                        _c.sent();
                        return [4 /*yield*/, page.type('#land_size', this.surfaceArea)];
                    case 37:
                        _c.sent();
                        return [4 /*yield*/, page.type('input[name="data[ad_price]"]', this.price)];
                    case 38:
                        _c.sent();
                        return [4 /*yield*/, page.type('textarea#ad_desc_en', this.content)];
                    case 39:
                        _c.sent();
                        imageInputSelector = 'input[name="files[]"]';
                        return [4 /*yield*/, page.waitForSelector(imageInputSelector)];
                    case 40:
                        _c.sent();
                        return [4 /*yield*/, page.$$(imageInputSelector)];
                    case 41:
                        inputUploadHandles = _c.sent();
                        inputUploadHandle = inputUploadHandles[0];
                        filesToUpload = this.getImagesToPost();
                        return [4 /*yield*/, page.$$('.fileuploader-action-remove')];
                    case 42:
                        removeImageBtns = _c.sent();
                        _c.label = 43;
                    case 43:
                        _c.trys.push([43, 49, 50, 51]);
                        removeImageBtns_1 = __values(removeImageBtns), removeImageBtns_1_1 = removeImageBtns_1.next();
                        _c.label = 44;
                    case 44:
                        if (!!removeImageBtns_1_1.done) return [3 /*break*/, 48];
                        removeImageBtn = removeImageBtns_1_1.value;
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 45:
                        _c.sent(); //enter to confirm yes in confirm dialog popup
                        return [4 /*yield*/, removeImageBtn.click()];
                    case 46:
                        _c.sent();
                        _c.label = 47;
                    case 47:
                        removeImageBtns_1_1 = removeImageBtns_1.next();
                        return [3 /*break*/, 44];
                    case 48: return [3 /*break*/, 51];
                    case 49:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 51];
                    case 50:
                        try {
                            if (removeImageBtns_1_1 && !removeImageBtns_1_1.done && (_a = removeImageBtns_1.return)) _a.call(removeImageBtns_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 51:
                        //we can only upload up to 6 files, therefore if we have more we need to remove the extra ones
                        if (filesToUpload.length > 6) {
                            filesToUploadLimited = [];
                            count = 1;
                            try {
                                for (filesToUpload_1 = __values(filesToUpload), filesToUpload_1_1 = filesToUpload_1.next(); !filesToUpload_1_1.done; filesToUpload_1_1 = filesToUpload_1.next()) {
                                    file = filesToUpload_1_1.value;
                                    if (count > 6) {
                                        break;
                                    }
                                    filesToUploadLimited.push(file);
                                    count++;
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (filesToUpload_1_1 && !filesToUpload_1_1.done && (_b = filesToUpload_1.return)) _b.call(filesToUpload_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            filesToUpload = filesToUploadLimited;
                        }
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, __spread(filesToUpload))];
                    case 52:
                        _c.sent();
                        //select property location
                        return [4 /*yield*/, page.click('div.select_area')];
                    case 53:
                        //select property location
                        _c.sent();
                        return [4 /*yield*/, page.click('label[for="area_1006"]')];
                    case 54:
                        _c.sent();
                        provinceSelector = 'label[for="province_11"]';
                        return [4 /*yield*/, page.click('#select_province_val')];
                    case 55:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 56:
                        _c.sent();
                        return [4 /*yield*/, page.waitForSelector(provinceSelector)];
                    case 57:
                        _c.sent();
                        return [4 /*yield*/, page.click(provinceSelector)];
                    case 58:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 59:
                        _c.sent();
                        return [4 /*yield*/, page.click('#select_city_val')];
                    case 60:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 61:
                        _c.sent();
                        pattayaCentralOption = 'label[for="city_1075"]';
                        return [4 /*yield*/, page.waitForSelector(pattayaCentralOption)];
                    case 62:
                        _c.sent();
                        return [4 /*yield*/, page.click(pattayaCentralOption)];
                    case 63:
                        _c.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 64:
                        _c.sent();
                        submitButtonSelector = '#placecomplete';
                        return [4 /*yield*/, page.waitForSelector(submitButtonSelector)];
                    case 65:
                        _c.sent();
                        return [4 /*yield*/, page.click(submitButtonSelector)];
                    case 66:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BathsoldPoster.prototype.lunchBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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