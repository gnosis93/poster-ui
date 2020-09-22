"use strict";
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
exports.PostsHelper = void 0;
//importing necessary modules
var path = require("path");
var fs = require("fs");
var PostsHelper = /** @class */ (function () {
    function PostsHelper() {
    }
    PostsHelper.getPostsDir = function () {
        var app = require('electron').app;
        var homedir = app.getPath('userData');
        var dirPath = path.join(homedir, 'posts');
        return dirPath;
    };
    PostsHelper.getListOfPosts = function () {
        var dirPath = this.getPostsDir();
        if (fs.existsSync(dirPath) === false) {
            var errMsg = "Posts directory does not exist!! " + dirPath;
            console.error(errMsg);
            throw errMsg;
        }
        // let result = fs.readdirSync(dirPath);
        //filter all files and directories to only directories
        var directoriesInPostsDir = fs.readdirSync(dirPath).filter(function (f) { return fs.statSync(path.join(dirPath, f)).isDirectory(); });
        return {
            'postsDirs': directoriesInPostsDir,
            'postsDirPath': dirPath
        };
    };
    PostsHelper.redefineListOfPosts = function (posts, postsDirPath) {
        var e_1, _a;
        var redefinedPosts = [];
        try {
            for (var posts_1 = __values(posts), posts_1_1 = posts_1.next(); !posts_1_1.done; posts_1_1 = posts_1.next()) {
                var postDirName = posts_1_1.value;
                var redefined = PostsHelper.getPostByName(postDirName, postsDirPath);
                redefinedPosts.push(redefined);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (posts_1_1 && !posts_1_1.done && (_a = posts_1.return)) _a.call(posts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return redefinedPosts;
    };
    PostsHelper.getPostByName = function (postDirName, postsDirPath) {
        if (postsDirPath === void 0) { postsDirPath = null; }
        if (postsDirPath === null) {
            postsDirPath = this.getPostsDir();
        }
        var dirPath = path.join(postsDirPath, postDirName);
        var redefined = {
            name: postDirName,
            dirPath: dirPath,
            images: PostsHelper.getPostImages(dirPath),
            content: PostsHelper.getPostContent(dirPath),
            metaData: PostsHelper.getPostMetaData(dirPath)
        };
        return redefined;
    };
    PostsHelper.getPostMetaData = function (dirPath) {
        var jsonFileLocation = (path.join(dirPath, 'metadata.json'));
        if (fs.existsSync(jsonFileLocation) == false) {
            return null;
        }
        return JSON.parse(fs.readFileSync(jsonFileLocation).toString());
    };
    PostsHelper.deletePostByName = function (postDirName, postsDirPath) {
        if (postsDirPath === void 0) { postsDirPath = null; }
        if (postsDirPath === null) {
            postsDirPath = this.getPostsDir();
        }
        var result = true;
        var dirName = path.join(postsDirPath, postDirName);
        if (fs.existsSync(dirName) === true) {
            fs.rmdirSync(dirName, { recursive: true });
        }
        //     let posts = this.getListOfPosts();
        //     return this.redefineListOfPosts(posts.postsDirs, posts.postsDirPath);
        return result;
    };
    PostsHelper.getPostContent = function (postDirPath) {
        var contentFilePath = path.join(postDirPath, PostsHelper.CONTENT_FILE_NAME);
        if (fs.existsSync(contentFilePath) === false) {
            var errMsg = "Posts Content file does not exist!! " + contentFilePath;
            console.error(errMsg);
            throw errMsg;
        }
        return fs.readFileSync(contentFilePath).toString();
    };
    PostsHelper.getPostImages = function (postDirPath) {
        var e_2, _a;
        if (fs.existsSync(postDirPath) === false) {
            var errMsg = "Posts directory does not exist!! " + postDirPath;
            console.error(errMsg);
            throw errMsg;
        }
        var filesInDir = fs.readdirSync(postDirPath);
        var imageFiles = Array();
        try {
            for (var filesInDir_1 = __values(filesInDir), filesInDir_1_1 = filesInDir_1.next(); !filesInDir_1_1.done; filesInDir_1_1 = filesInDir_1.next()) {
                var file = filesInDir_1_1.value;
                if (!file || file.indexOf('.') === -1) {
                    continue;
                }
                var fileNameExploded = file.split('.');
                var fileExtension = fileNameExploded.length > 1 ? fileNameExploded[fileNameExploded.length - 1] : null;
                if (!fileExtension || PostsHelper.ACCEPTED_IMAGES.indexOf(String(fileExtension)) === -1) {
                    continue;
                }
                imageFiles.push({
                    imageURL: path.join(postDirPath, file),
                    selected: true
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (filesInDir_1_1 && !filesInDir_1_1.done && (_a = filesInDir_1.return)) _a.call(filesInDir_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return imageFiles;
    };
    PostsHelper.CONTENT_FILE_NAME = 'text.txt';
    PostsHelper.ACCEPTED_IMAGES = [
        'jpg', 'jpeg', 'png', 'gif'
    ];
    return PostsHelper;
}());
exports.PostsHelper = PostsHelper;
//# sourceMappingURL=posts.helper.js.map