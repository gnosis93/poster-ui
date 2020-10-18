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
exports.FacebookOldGroupPoster = void 0;
var config_helper_1 = require("../../helpers/config.helper");
var screenshot_helper_1 = require("../../helpers/screenshot.helper");
var facebook_base_1 = require("./facebook.base");
var FacebookOldGroupPoster = /** @class */ (function (_super) {
    __extends(FacebookOldGroupPoster, _super);
    function FacebookOldGroupPoster(postPages, credentials, imagesToPost, content) {
        var _this = _super.call(this, credentials) || this;
        _this.postPages = postPages;
        _this.imagesToPost = imagesToPost;
        _this.content = content;
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
    FacebookOldGroupPoster.prototype.getPostPages = function () {
        return this.postPages;
    };
    FacebookOldGroupPoster.prototype.run = function (onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, browser, loginPage, postedPages;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, config_helper_1.ConfigHelper.getConfigValue('navigation_timeout', this.timeout)];
                    case 1:
                        _a.timeout = _b.sent();
                        return [4 /*yield*/, this.lunchBrowser()];
                    case 2:
                        browser = _b.sent();
                        return [4 /*yield*/, this.login(browser)];
                    case 3:
                        loginPage = _b.sent();
                        return [4 /*yield*/, this.postToPages(browser, onPageUploadedCallback)];
                    case 4:
                        postedPages = _b.sent();
                        return [4 /*yield*/, screenshot_helper_1.ScreenshootHelper.takeSuccessScreenShot('FB-OLD-GROUP-POST', this.Browser)];
                    case 5:
                        _b.sent();
                        if (!((config_helper_1.ConfigHelper.getConfigValue('headless', false)) === true || config_helper_1.ConfigHelper.getConfigValue('close_browser'))) return [3 /*break*/, 7];
                        return [4 /*yield*/, browser.close()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, true];
                }
            });
        });
    };
    FacebookOldGroupPoster.prototype.postToPages = function (browser, onPageUploadedCallback) {
        if (onPageUploadedCallback === void 0) { onPageUploadedCallback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var pages, count, _a, _b, group, groupPage, fileInputSelector, inputUploadHandles, inputUploadHandle, filesToUpload, postButtonQuery, postButton, disabledJSHandle, disabledValue, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        pages = [];
                        count = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 22, 23, 24]);
                        _a = __values(this.getPostPages()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 21];
                        group = _b.value;
                        count++;
                        return [4 /*yield*/, browser.newPage()];
                    case 3:
                        groupPage = _d.sent();
                        // await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        return [4 /*yield*/, groupPage.goto(group, { waitUntil: 'networkidle2', timeout: this.timeout })];
                    case 4:
                        // await groupPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        _d.sent();
                        return [4 /*yield*/, groupPage.keyboard.press('p')];
                    case 5:
                        _d.sent();
                        // await groupPage.click('textarea#js_1g');
                        return [4 /*yield*/, groupPage.keyboard.type(this.content)];
                    case 6:
                        // await groupPage.click('textarea#js_1g');
                        _d.sent(); // click submit
                        return [4 /*yield*/, this.delay(2000)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, groupPage.click('a[label="Photo/Video"]')];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, this.delay(500)];
                    case 9:
                        _d.sent();
                        fileInputSelector = 'input[aria-label="Add Photo or Video"]';
                        return [4 /*yield*/, groupPage.$$(fileInputSelector)];
                    case 10:
                        inputUploadHandles = _d.sent();
                        if (inputUploadHandles.length == 0) {
                            throw ('Unable to find image upload input selector: ' + fileInputSelector);
                        }
                        inputUploadHandle = inputUploadHandles[0];
                        filesToUpload = this.getImagesToPost();
                        // console.log('Post Images',filesToUpload);
                        return [4 /*yield*/, this.delay(100)];
                    case 11:
                        // console.log('Post Images',filesToUpload);
                        _d.sent();
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        //     await inputUploadHandle.uploadFile(fileToUpload);
                        //     await this.delay(500);
                        // }
                        return [4 /*yield*/, inputUploadHandle.uploadFile.apply(inputUploadHandle, __spread(filesToUpload))];
                    case 12:
                        // await groupPage.waitForSelector('.bp9cbjyn .j83agx80.datstx6m.taijpn5t.l9j0dhe7.k4urcfbm');
                        // console.log('File Upload Handles (File Inputs)',inputUploadHandles);
                        // Sets the value of the file input to fileToUpload
                        // for(let fileToUpload of filesToUpload){
                        //     await inputUploadHandle.uploadFile(fileToUpload);
                        //     await this.delay(500);
                        // }
                        _d.sent();
                        postButtonQuery = 'button[type=submit]._1mf7';
                        return [4 /*yield*/, groupPage.$$(postButtonQuery)];
                    case 13:
                        postButton = _d.sent();
                        _d.label = 14;
                    case 14:
                        if (!true) return [3 /*break*/, 18];
                        return [4 /*yield*/, postButton[0].getProperty('attributes')];
                    case 15:
                        disabledJSHandle = _d.sent();
                        return [4 /*yield*/, disabledJSHandle.jsonValue()];
                    case 16:
                        disabledValue = _d.sent();
                        // console.log('disabled attributes' , disabledValue);
                        // postButton[0].
                        // console.log(disabledValue);
                        if (typeof disabledValue['3'] === 'undefined') {
                            return [3 /*break*/, 18];
                        }
                        return [4 /*yield*/, this.delay(100)];
                    case 17:
                        _d.sent();
                        return [3 /*break*/, 14];
                    case 18: return [4 /*yield*/, groupPage.click(postButtonQuery)];
                    case 19:
                        _d.sent();
                        if (onPageUploadedCallback !== null) {
                            onPageUploadedCallback(groupPage, count);
                        }
                        pages.push(groupPage);
                        _d.label = 20;
                    case 20:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 21: return [3 /*break*/, 24];
                    case 22:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 24];
                    case 23:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 24: return [2 /*return*/, pages];
                }
            });
        });
    };
    return FacebookOldGroupPoster;
}(facebook_base_1.FacebookBase));
exports.FacebookOldGroupPoster = FacebookOldGroupPoster;
//# sourceMappingURL=facebook-old.group.poster.js.map