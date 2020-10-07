"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelBase = void 0;
var puppeteer = require("puppeteer");
var path = require("path");
var config_helper_1 = require("../helpers/config.helper");
var app = require('electron').app;
var ChannelBase = /** @class */ (function () {
    function ChannelBase() {
    }
    Object.defineProperty(ChannelBase.prototype, "Browser", {
        get: function () { return this.browser; },
        enumerable: false,
        configurable: true
    });
    ChannelBase.prototype.lunchBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 6]);
                        _a = this;
                        return [4 /*yield*/, puppeteer.launch({
                                executablePath: config_helper_1.ConfigHelper.getConfigValue('chrome_executable_path'),
                                headless: config_helper_1.ConfigHelper.getConfigValue('headless', false),
                                defaultViewport: null,
                                args: ['--start-maximized', "--disable-notifications"]
                            })];
                    case 1:
                        _a.browser = _b.sent();
                        return [2 /*return*/, this.browser];
                    case 2:
                        e_1 = _b.sent();
                        console.log('Failed to lunch browser, exception message: ' + e_1.toString());
                        if (!this.browser) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.browser.close()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, this.lunchBrowser()];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChannelBase.prototype.kill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.browser.close()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_2 = _a.sent();
                        console.log('Failed to kill channel posting process, exception ' + e_2.toString());
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    ChannelBase.prototype.threeClickType = function (page, selector, value) {
        return __awaiter(this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.$(selector)];
                    case 1:
                        input = _a.sent();
                        if (input === null) {
                            throw 'ThreeClickType Exception: unable to find specfied selector: ' + selector;
                        }
                        return [4 /*yield*/, input.click({ clickCount: 3 })];
                    case 2:
                        _a.sent(); //selects all text in input thus causing it to be deleted
                        return [4 /*yield*/, input.type(value)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelBase.prototype.getPathInUserData = function (pathToFile) {
        return path.join(app.getPath('userData'), pathToFile);
    };
    ChannelBase.prototype.getPostsDir = function (additonalPath) {
        if (additonalPath === void 0) { additonalPath = null; }
        if (additonalPath == null) {
            return path.join(app.getPath('userData'), 'posts');
        }
        else {
            return path.join(app.getPath('userData'), 'posts', additonalPath);
        }
    };
    /**
     * Helper function to delay the process , used to await loading of elements/html
     * @param time time in miliseconds
     */
    ChannelBase.prototype.delay = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(resolve, time);
                    })];
            });
        });
    };
    ChannelBase.prototype.getActivePage = function (browser, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var start, pages, arr, pages_1, pages_1_1, p, e_3_1;
            var e_3, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        start = new Date().getTime();
                        _b.label = 1;
                    case 1:
                        if (!(new Date().getTime() - start < timeout)) return [3 /*break*/, 11];
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        pages = _b.sent();
                        arr = [];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        pages_1 = (e_3 = void 0, __values(pages)), pages_1_1 = pages_1.next();
                        _b.label = 4;
                    case 4:
                        if (!!pages_1_1.done) return [3 /*break*/, 7];
                        p = pages_1_1.value;
                        return [4 /*yield*/, p.evaluate(function () { return document.visibilityState == 'visible'; })];
                    case 5:
                        if (_b.sent()) {
                            arr.push(p);
                        }
                        _b.label = 6;
                    case 6:
                        pages_1_1 = pages_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (pages_1_1 && !pages_1_1.done && (_a = pages_1.return)) _a.call(pages_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (arr.length == 1)
                            return [2 /*return*/, arr[0]];
                        return [3 /*break*/, 1];
                    case 11: throw "Unable to get active page";
                }
            });
        });
    };
    ChannelBase.prototype.clickTickboxByIndex = function (page, selectionIndex, querySelector, awaitNavigation) {
        if (querySelector === void 0) { querySelector = ".selection-list>li>label>.right-side"; }
        if (awaitNavigation === void 0) { awaitNavigation = true; }
        return __awaiter(this, void 0, void 0, function () {
            var result, elements, _a, _b, _c, i, link, e_4_1;
            var e_4, _d;
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
                        e_4_1 = _e.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
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
    return ChannelBase;
}());
exports.ChannelBase = ChannelBase;
//# sourceMappingURL=channel.base.js.map