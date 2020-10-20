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
exports.ScreenshootHelper = void 0;
var helper_base_1 = require("./helper.base");
var config_helper_1 = require("./config.helper");
var path = require("path");
var fs = require("fs");
var moment = require("moment");
var ScreenshootHelper = /** @class */ (function (_super) {
    __extends(ScreenshootHelper, _super);
    function ScreenshootHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScreenshootHelper.takeErrorScreenShot = function (msg, browser, error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.takeScreenShot(msg, browser, 'error', error)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScreenshootHelper.takeSuccessScreenShot = function (msg, browser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.takeScreenShot(msg, browser, 'success', null)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScreenshootHelper.takeScreenShot = function (msg, browser, type, error) {
        if (error === void 0) { error = null; }
        return __awaiter(this, void 0, void 0, function () {
            var page, fileName, fullPath, _a, _b, logMsg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!browser || browser.isConnected() === false) {
                            console.warn('Failed to take ' + type + ' screenshot, browser is no longer connected');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getActivePage(browser)];
                    case 1:
                        page = _c.sent();
                        fileName = moment().format('HH:MM') + '_' + msg + '.jpg';
                        fileName = fileName.replaceAll(':', '-');
                        fileName = fileName.replaceAll(' ', '-');
                        _b = (_a = path).join;
                        return [4 /*yield*/, this.getScreenshotDir(type)];
                    case 2:
                        fullPath = _b.apply(_a, [(_c.sent()), fileName]);
                        return [4 /*yield*/, this.delay(5000)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.screenshot({
                                type: "jpeg",
                                fullPage: true,
                                path: fullPath
                            })];
                    case 4:
                        _c.sent();
                        logMsg = String(type) + ' screenshot saved at:' + String(fullPath);
                        if (error) {
                            logMsg = logMsg + 'Exepction: ' + String(error);
                        }
                        console.log(logMsg);
                        return [2 /*return*/];
                }
            });
        });
    };
    ScreenshootHelper.getScreenshotDir = function (ssType) {
        return __awaiter(this, void 0, void 0, function () {
            var mainDataFolderPath, ssPath, dateFolder, ssPathType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mainDataFolderPath = ScreenshootHelper.getMainContentPath();
                        ssPath = path.join(mainDataFolderPath, 'screenshots');
                        return [4 /*yield*/, this.makeDirIfNotExists(ssPath)];
                    case 1:
                        _a.sent();
                        dateFolder = path.join(ssPath, this.getSSDateFolder());
                        return [4 /*yield*/, this.makeDirIfNotExists(dateFolder)];
                    case 2:
                        _a.sent();
                        ssPathType = path.join(dateFolder, ssType);
                        return [4 /*yield*/, this.makeDirIfNotExists(ssPathType)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ssPathType];
                }
            });
        });
    };
    ScreenshootHelper.makeDirIfNotExists = function (dirPath) {
        if (fs.existsSync(dirPath) === false) {
            fs.mkdirSync(dirPath);
            return true;
        }
        return false;
    };
    ScreenshootHelper.getSSDateFolder = function () {
        return moment().format('YYYY-MM-DD');
    };
    ScreenshootHelper.getActivePage = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout, start, pages, arr, pages_1, pages_1_1, p, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeout = config_helper_1.ConfigHelper.getConfigValue('navigation_timeout', 10000);
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
                        pages_1 = (e_1 = void 0, __values(pages)), pages_1_1 = pages_1.next();
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
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (pages_1_1 && !pages_1_1.done && (_a = pages_1.return)) _a.call(pages_1);
                        }
                        finally { if (e_1) throw e_1.error; }
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
    return ScreenshootHelper;
}(helper_base_1.BaseHelper));
exports.ScreenshootHelper = ScreenshootHelper;
//# sourceMappingURL=screenshot.helper.js.map