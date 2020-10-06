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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueScheduler = void 0;
var config_helper_1 = require("../helpers/config.helper");
var craigslist_group_poster_1 = require("../channels/craigslist/craigslist.group.poster");
var posts_helper_1 = require("../helpers/posts.helper");
var logger_helper_1 = require("../helpers/logger.helper");
var moment = require("moment");
var schedule = require("node-schedule");
var QueueScheduler = /** @class */ (function () {
    function QueueScheduler() {
        this.queuedPosts = [];
        this.defaultPost = {
            name: 'bangkok',
            selected: true,
            lang: 'thai',
            currency: 'THB'
        };
    }
    QueueScheduler.prototype.buildQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var postsFetch, _a, _b, postDir, post;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, posts_helper_1.PostsHelper.getListOfPosts()];
                    case 1:
                        postsFetch = (_d.sent());
                        try {
                            // let post
                            for (_a = __values(postsFetch.postsDirs), _b = _a.next(); !_b.done; _b = _a.next()) {
                                postDir = _b.value;
                                post = posts_helper_1.PostsHelper.getPostByName(postDir);
                                if (QueueScheduler.postExistsInLogs(post) === false) {
                                    this.queuedPosts.push(post);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QueueScheduler.postExistsInLogs = function (post) {
        var e_2, _a;
        var _b;
        if (QueueScheduler.allLogs.length == 0) {
            QueueScheduler.allLogs = logger_helper_1.LoggerHelper.getAllLogs(logger_helper_1.LogChannel.scheduler);
        }
        if (this.postExpiryTime === null) {
            this.postExpiryTime = config_helper_1.ConfigHelper.getConfigValue('post_expiry_time', 30);
        }
        try {
            for (var _c = __values(QueueScheduler.allLogs), _d = _c.next(); !_d.done; _d = _c.next()) {
                var log = _d.value;
                if ((log === null || log === void 0 ? void 0 : log.logSeverity) == logger_helper_1.LogSeverity.info && (log === null || log === void 0 ? void 0 : log.message) === QueueScheduler.LOG_MESSAGE && ((_b = log === null || log === void 0 ? void 0 : log.additionalData) === null || _b === void 0 ? void 0 : _b.name) == post.name) {
                    var logISRecent = moment(log.date).add(this.postExpiryTime, 'days').isAfter(moment()); //log is recent if it hasn't expired (as per POST_EXPIRY_DAYS const)
                    if (logISRecent) {
                        return true;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    QueueScheduler.prototype.handleQueue = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var postingsPerCronTrigger, i, currentPost;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.queuedPosts.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.buildQueue()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        postingsPerCronTrigger = (_a = config_helper_1.ConfigHelper.getConfigValue('postings_per_trigger')) !== null && _a !== void 0 ? _a : 1;
                        i = 1;
                        _b.label = 3;
                    case 3:
                        if (!(i <= postingsPerCronTrigger)) return [3 /*break*/, 6];
                        currentPost = this.queuedPosts.pop();
                        return [4 /*yield*/, this.handleQueueItem(currentPost, this.defaultPost)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QueueScheduler.prototype.handleQueueItem = function (post, city) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var config, result, poster, e_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof post == 'undefined' || !post) {
                            logger_helper_1.LoggerHelper.err('Invalid post given to handleQueueItem()', null, logger_helper_1.LogChannel.scheduler);
                        }
                        config = config_helper_1.ConfigHelper.getConfig();
                        result = false;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        poster = new craigslist_group_poster_1.CraigslistPoster({
                            username: config.craigslist_email,
                            password: config.craigslist_password
                        }, post.images, config_helper_1.ConfigHelper.parseTextTemplate(post, city.lang), (_a = post === null || post === void 0 ? void 0 : post.metaData) === null || _a === void 0 ? void 0 : _a.title, 'Pattaya', (_b = post.metaData) === null || _b === void 0 ? void 0 : _b.price, (_c = post === null || post === void 0 ? void 0 : post.metaData) === null || _c === void 0 ? void 0 : _c.size, config_helper_1.ConfigHelper.getConfigValue('phone_number'), config_helper_1.ConfigHelper.getConfigValue('phone_extension'), city.name, config_helper_1.ConfigHelper.getConfigValue('post_immediately', false));
                        return [4 /*yield*/, poster.run()];
                    case 2:
                        result = _d.sent();
                        logger_helper_1.LoggerHelper.info(QueueScheduler.LOG_MESSAGE, post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _d.sent();
                        result = false;
                        console.error(e_3);
                        logger_helper_1.LoggerHelper.err(QueueScheduler.LOG_MESSAGE_FAIL + ' exception: ' + e_3.toString(), post, logger_helper_1.LogChannel.scheduler);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    QueueScheduler.prototype.shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex = currentIndex - 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    QueueScheduler.registerSchedule = function () {
        var queueScheduler = new QueueScheduler();
        var schedulerCRONConfig = config_helper_1.ConfigHelper.getConfigValue('scheduler_cron', false);
        schedule.scheduleJob(schedulerCRONConfig, function () {
            queueScheduler.handleQueue();
        });
    };
    QueueScheduler.LOG_MESSAGE = 'Scheduler posted successfully';
    QueueScheduler.LOG_MESSAGE_FAIL = 'Scheduler posted failed';
    QueueScheduler.postExpiryTime = null;
    QueueScheduler.allLogs = [];
    return QueueScheduler;
}());
exports.QueueScheduler = QueueScheduler;
//# sourceMappingURL=QueueScheduler.js.map