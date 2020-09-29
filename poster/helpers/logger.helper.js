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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHelper = exports.LogSeverity = exports.LogChannel = void 0;
var fs = require("fs");
var helper_base_1 = require("./helper.base");
var path = require("path");
var LogChannel;
(function (LogChannel) {
    LogChannel[LogChannel["scheduler"] = 0] = "scheduler";
    LogChannel[LogChannel["general"] = 1] = "general";
})(LogChannel = exports.LogChannel || (exports.LogChannel = {}));
;
var LogSeverity;
(function (LogSeverity) {
    LogSeverity[LogSeverity["warn"] = 0] = "warn";
    LogSeverity[LogSeverity["err"] = 1] = "err";
    LogSeverity[LogSeverity["info"] = 2] = "info";
})(LogSeverity = exports.LogSeverity || (exports.LogSeverity = {}));
var LoggerHelper = /** @class */ (function (_super) {
    __extends(LoggerHelper, _super);
    function LoggerHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoggerHelper.warn = function (message, additionalData, logChannel) {
        if (additionalData === void 0) { additionalData = null; }
        if (logChannel === void 0) { logChannel = LogChannel.general; }
        this.writeLog(message, additionalData, logChannel, LogSeverity.warn);
    };
    LoggerHelper.err = function (message, additionalData, logChannel) {
        if (additionalData === void 0) { additionalData = null; }
        if (logChannel === void 0) { logChannel = LogChannel.general; }
        this.writeLog(message, additionalData, logChannel, LogSeverity.err);
    };
    LoggerHelper.info = function (message, additionalData, logChannel) {
        if (additionalData === void 0) { additionalData = null; }
        if (logChannel === void 0) { logChannel = LogChannel.general; }
        this.writeLog(message, additionalData, logChannel, LogSeverity.info);
    };
    LoggerHelper.writeLog = function (message, additionalData, logChannel, logSeverity) {
        if (additionalData === void 0) { additionalData = null; }
        if (logChannel === void 0) { logChannel = LogChannel.general; }
        if (logSeverity === void 0) { logSeverity = LogSeverity.info; }
        var allLogs = this.getAllLogs(logChannel);
        var newLog = {
            logSeverity: logSeverity,
            message: message,
            additionalData: additionalData,
            date: new Date().getTime()
        };
        console.log('logger event', newLog);
        allLogs.push(newLog);
        var logChannelPath = LoggerHelper.getLogChannelPath(logChannel);
        return fs.writeFileSync(logChannelPath, JSON.stringify(allLogs));
    };
    LoggerHelper.getAllLogs = function (logChannel) {
        var logFilePath = this.getLogChannelPath(logChannel);
        //create log file if it doesn't exist
        if (fs.existsSync(logFilePath) === false) {
            this.createEmptyLogFile(logFilePath);
        }
        var fileContents = fs.readFileSync(logFilePath).toString();
        if (!fileContents || fileContents.length == 0) {
            fileContents = JSON.stringify(this.createEmptyLogFile(logFilePath));
        }
        // let rawData =
        return JSON.parse(fileContents);
    };
    LoggerHelper.createEmptyLogFile = function (logFilePath) {
        var logData = [];
        fs.writeFileSync(logFilePath, JSON.stringify(logData));
        return logData;
    };
    LoggerHelper.getLogChannelPath = function (logChannel) {
        var postsDir = this.getPostsDir();
        var logFileName = LogChannel[logChannel] + '.log.json';
        var logPath = path.join(postsDir, logFileName);
        return logPath;
    };
    return LoggerHelper;
}(helper_base_1.BaseHelper));
exports.LoggerHelper = LoggerHelper;
//# sourceMappingURL=logger.helper.js.map