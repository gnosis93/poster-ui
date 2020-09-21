"use strict";
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
        var redefinedPosts = [];
        for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
            var postDirName = posts_1[_i];
            var redefined = PostsHelper.getPostByName(postDirName, postsDirPath);
            redefinedPosts.push(redefined);
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
        if (fs.existsSync(postDirPath) === false) {
            var errMsg = "Posts directory does not exist!! " + postDirPath;
            console.error(errMsg);
            throw errMsg;
        }
        var filesInDir = fs.readdirSync(postDirPath);
        var imageFiles = Array();
        for (var _i = 0, filesInDir_1 = filesInDir; _i < filesInDir_1.length; _i++) {
            var file = filesInDir_1[_i];
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