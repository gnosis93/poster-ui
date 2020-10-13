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
exports.FacebookPageQueueScheduler = void 0;
var QueueScheduler_base_1 = require("./QueueScheduler.base");
var config_helper_1 = require("../helpers/config.helper");
var logger_helper_1 = require("../helpers/logger.helper");
var facebook_page_poster_1 = require("../channels/facebook/facebook.page.poster");
var facebook_old_page_poster_1 = require("../channels/facebook/facebook-old.page.poster");
var screenshot_helper_1 = require("../helpers/screenshot.helper");
var FacebookPageQueueScheduler = /** @class */ (function (_super) {
    __extends(FacebookPageQueueScheduler, _super);
    function FacebookPageQueueScheduler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ENABLE_SCHEDULER_KEY = 'facebookpages_enable_scheduler';
        _this.POST_EXPIRY_TIME_CONFIG_KEY = 'facebookpages_post_expiry_time';
        _this.cronValueConfigKey = 'facebookpages_scheduler_cron';
        _this.LOG_MESSAGE = 'FacebookPages Scheduler posted successfully';
        _this.LOG_MESSAGE_FAIL = 'FacebookPages Scheduler posted failed';
        return _this;
    }
    FacebookPageQueueScheduler.getInstance = function () {
        if (FacebookPageQueueScheduler.singleton == null) {
            FacebookPageQueueScheduler.singleton = new FacebookPageQueueScheduler();
        }
        return FacebookPageQueueScheduler.singleton;
    };
    FacebookPageQueueScheduler.prototype.handleQueueItem = function (post, city) {
        return __awaiter(this, void 0, void 0, function () {
            var config, result, poster, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof post == 'undefined' || !post) {
                            logger_helper_1.LoggerHelper.err('Invalid post given to handleQueueItem()', null, logger_helper_1.LogChannel.scheduler);
                        }
                        config = config_helper_1.ConfigHelper.getConfig();
                        result = false;
                        poster = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 9]);
                        if (!(config.facebook_old_style === true)) return [3 /*break*/, 3];
                        poster = new facebook_page_poster_1.FacebookPagePoster(config.facebook_pages, {
                            username: config.facebook_email,
                            password: config.facebook_password
                        }, post.images, config_helper_1.ConfigHelper.parseTextTemplate(post, city.lang));
                        return [4 /*yield*/, poster.run()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        poster = new facebook_old_page_poster_1.FacebookOldPagePoster(config.facebook_pages, {
                            username: config.facebook_email,
                            password: config.facebook_password
                        }, post.images, config_helper_1.ConfigHelper.parseTextTemplate(post, city.lang));
                        return [4 /*yield*/, poster.run()];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        logger_helper_1.LoggerHelper.info(this.LOG_MESSAGE, post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 9];
                    case 6:
                        e_1 = _a.sent();
                        result = false;
                        console.error(e_1);
                        return [4 /*yield*/, screenshot_helper_1.ScreenshootHelper.takeErrorScreenShot('facebookPages_' + post.name, poster.Browser, e_1.toString())];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, poster.kill()];
                    case 8:
                        _a.sent();
                        logger_helper_1.LoggerHelper.err(this.LOG_MESSAGE_FAIL + ' exception: ' + e_1.toString(), post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    FacebookPageQueueScheduler.singleton = null;
    return FacebookPageQueueScheduler;
}(QueueScheduler_base_1.QueueScheduler));
exports.FacebookPageQueueScheduler = FacebookPageQueueScheduler;
//# sourceMappingURL=FacebookQueueScheduler.js.map