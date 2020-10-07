"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHelper = void 0;
//importing necessary modules
var path = require("path");
var BaseHelper = /** @class */ (function () {
    function BaseHelper() {
    }
    BaseHelper.getPostsDir = function () {
        var homedir = this.getMainContentPath();
        var dirPath = path.join(homedir, 'posts');
        return dirPath;
    };
    BaseHelper.getMainContentPath = function () {
        var app = require('electron').app;
        var userData = app.getPath('userData');
        return userData;
    };
    return BaseHelper;
}());
exports.BaseHelper = BaseHelper;
//# sourceMappingURL=helper.base.js.map