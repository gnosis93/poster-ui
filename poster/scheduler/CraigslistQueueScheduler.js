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
exports.CraigslistQueueScheduler = void 0;
var QueueScheduler_base_1 = require("./QueueScheduler.base");
var config_helper_1 = require("../helpers/config.helper");
var craigslist_group_poster_1 = require("../channels/craigslist/craigslist.group.poster");
var logger_helper_1 = require("../helpers/logger.helper");
var CraigslistQueueScheduler = /** @class */ (function (_super) {
    __extends(CraigslistQueueScheduler, _super);
    function CraigslistQueueScheduler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cronValueConfigKey = 'criagslist_scheduler_cron';
        _this.POST_EXPIRY_TIME_CONFIG_KEY = 'criagslist_post_expiry_time';
        _this.ENABLE_SCHEDULER_KEY = 'criagslist_enable_scheduler';
        _this.LOG_MESSAGE = 'Craigslist Scheduler posted successfully';
        _this.LOG_MESSAGE_FAIL = 'Craigslist Scheduler posted failed';
        return _this;
    }
    CraigslistQueueScheduler.getInstance = function () {
        if (CraigslistQueueScheduler.singleton == null) {
            CraigslistQueueScheduler.singleton = new CraigslistQueueScheduler();
        }
        return CraigslistQueueScheduler.singleton;
    };
    CraigslistQueueScheduler.prototype.handleQueueItem = function (post, city) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var config, result, poster, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof post == 'undefined' || !post) {
                            logger_helper_1.LoggerHelper.err('Invalid post given to handleQueueItem()', null, logger_helper_1.LogChannel.scheduler);
                        }
                        config = config_helper_1.ConfigHelper.getConfig();
                        result = false;
                        poster = null;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 5]);
                        // let price = await PostsHelper.handlePostPrice(post,city.currency);
                        poster = new craigslist_group_poster_1.CraigslistPoster({
                            username: config.craigslist_email,
                            password: config.craigslist_password
                        }, post.images, config_helper_1.ConfigHelper.parseTextTemplate(post, city.lang), (_a = post === null || post === void 0 ? void 0 : post.metaData) === null || _a === void 0 ? void 0 : _a.title, 'Pattaya', (_b = post.metaData) === null || _b === void 0 ? void 0 : _b.price, (_c = post === null || post === void 0 ? void 0 : post.metaData) === null || _c === void 0 ? void 0 : _c.size, config_helper_1.ConfigHelper.getConfigValue('phone_number'), config_helper_1.ConfigHelper.getConfigValue('phone_extension'), city.name, config_helper_1.ConfigHelper.getConfigValue('post_immediately', false));
                        return [4 /*yield*/, poster.run()];
                    case 2:
                        result = _d.sent();
                        logger_helper_1.LoggerHelper.info(this.LOG_MESSAGE, post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _d.sent();
                        result = false;
                        return [4 /*yield*/, poster.kill()];
                    case 4:
                        _d.sent();
                        console.error(e_1);
                        logger_helper_1.LoggerHelper.err(this.LOG_MESSAGE_FAIL + ' exception: ' + e_1.toString(), post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, result];
                }
            });
        });
    };
    CraigslistQueueScheduler.singleton = null;
    return CraigslistQueueScheduler;
}(QueueScheduler_base_1.QueueScheduler));
exports.CraigslistQueueScheduler = CraigslistQueueScheduler;
//# sourceMappingURL=CraigslistQueueScheduler.js.map