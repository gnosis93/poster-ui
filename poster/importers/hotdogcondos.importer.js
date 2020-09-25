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
exports.HotDogCondosImporter = void 0;
var puppeteer = require("puppeteer");
var path = require("path");
var fs = require("fs");
var https = require("https");
var config_helper_1 = require("../helpers/config.helper");
var posts_helper_1 = require("../helpers/posts.helper");
var Stream = require('stream').Transform;
var HotDogCondosImporter = /** @class */ (function () {
    function HotDogCondosImporter() {
    }
    HotDogCondosImporter.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var browser, mainPage, pagesUrls, propertiesUrls, pagesUrls_1, pagesUrls_1_1, pageUrl, pagePropertiesUrls, e_1_1, existingUrls, newUrls, newUrls_1, newUrls_1_1, propertyUrl, e_2_1;
            var e_1, _a, e_2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.lunchBrowser()];
                    case 1:
                        browser = _c.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        mainPage = _c.sent();
                        return [4 /*yield*/, this.scrapePagesUrls(mainPage)];
                    case 3:
                        pagesUrls = _c.sent();
                        propertiesUrls = [];
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 9, 10, 11]);
                        pagesUrls_1 = __values(pagesUrls), pagesUrls_1_1 = pagesUrls_1.next();
                        _c.label = 5;
                    case 5:
                        if (!!pagesUrls_1_1.done) return [3 /*break*/, 8];
                        pageUrl = pagesUrls_1_1.value;
                        return [4 /*yield*/, this.scrapeListingURLS(mainPage, pageUrl)];
                    case 6:
                        pagePropertiesUrls = _c.sent();
                        propertiesUrls = propertiesUrls.concat(pagePropertiesUrls);
                        _c.label = 7;
                    case 7:
                        pagesUrls_1_1 = pagesUrls_1.next();
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (pagesUrls_1_1 && !pagesUrls_1_1.done && (_a = pagesUrls_1.return)) _a.call(pagesUrls_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11: return [4 /*yield*/, this.getExistingPostsUrls()];
                    case 12:
                        existingUrls = _c.sent();
                        newUrls = propertiesUrls.filter(function (url) { return existingUrls.includes(url) === false; });
                        newUrls = newUrls.filter(function (v, i, a) { return a.indexOf(v) === i; }); //remove duplicates
                        _c.label = 13;
                    case 13:
                        _c.trys.push([13, 18, 19, 20]);
                        newUrls_1 = __values(newUrls), newUrls_1_1 = newUrls_1.next();
                        _c.label = 14;
                    case 14:
                        if (!!newUrls_1_1.done) return [3 /*break*/, 17];
                        propertyUrl = newUrls_1_1.value;
                        return [4 /*yield*/, this.scrapeProperty(propertyUrl, mainPage)];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16:
                        newUrls_1_1 = newUrls_1.next();
                        return [3 /*break*/, 14];
                    case 17: return [3 /*break*/, 20];
                    case 18:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 20];
                    case 19:
                        try {
                            if (newUrls_1_1 && !newUrls_1_1.done && (_b = newUrls_1.return)) _b.call(newUrls_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 20: 
                    // if((ConfigHelper.getConfigValue('headless',false) ) === true){
                    return [4 /*yield*/, browser.close()];
                    case 21:
                        // if((ConfigHelper.getConfigValue('headless',false) ) === true){
                        _c.sent();
                        // }
                        // this.scrapeListingURLS(browser,HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    HotDogCondosImporter.prototype.getExistingPostsUrls = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var posts, urls, _c, _d, postName, post, postUrl, e_3_1;
            var e_3, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, posts_helper_1.PostsHelper.getListOfPosts()];
                    case 1:
                        posts = _f.sent();
                        urls = [];
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 7, 8, 9]);
                        _c = __values(posts.postsDirs), _d = _c.next();
                        _f.label = 3;
                    case 3:
                        if (!!_d.done) return [3 /*break*/, 6];
                        postName = _d.value;
                        return [4 /*yield*/, posts_helper_1.PostsHelper.getPostByName(postName)];
                    case 4:
                        post = _f.sent();
                        postUrl = (_b = (_a = post === null || post === void 0 ? void 0 : post.metaData) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : null;
                        if (postUrl !== null) {
                            urls.push(postUrl);
                        }
                        _f.label = 5;
                    case 5:
                        _d = _c.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _f.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, urls];
                }
            });
        });
    };
    HotDogCondosImporter.prototype.scrapePagesUrls = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // let page      = await browser.newPage();
                    return [4 /*yield*/, page.goto(HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL, { waitUntil: 'networkidle2' })];
                    case 1:
                        // let page      = await browser.newPage();
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return Array.from(document.querySelectorAll('.pagination li a'), function (element) { return element.getAttribute('href'); }); })];
                    case 2:
                        urls = _a.sent();
                        urls.pop();
                        return [2 /*return*/, urls];
                }
            });
        });
    };
    HotDogCondosImporter.prototype.processPropertyFeatures = function (propertyMetaData) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                text = propertyMetaData.title + " is a new project that can be a great new investment opportunity or a place to call home . Located in Pattaya a highly touristic city with all the amenities you can imagine ! \n\nMore info at : " + propertyMetaData.url + "\n\nProperty Features: \n" + propertyMetaData.features + "\n\nCall for view:  " + (config_helper_1.ConfigHelper.getConfigValue('phone_extension') + ' ' + config_helper_1.ConfigHelper.getConfigValue('phone_number')) + "\n        ";
                return [2 /*return*/, text];
            });
        });
    };
    HotDogCondosImporter.prototype.scrapeProperty = function (pageUrl, page) {
        return __awaiter(this, void 0, void 0, function () {
            var title, images, propertyFeatures, postDirectoryPath, postDirectoryExists, beds, baths, size, floorNumber, price, metadata, textContent, images_1, images_1_1, imageUrl;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // let page    = await browser.newPage();
                    return [4 /*yield*/, page.goto(pageUrl, { waitUntil: 'networkidle2' })];
                    case 1:
                        // let page    = await browser.newPage();
                        _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#listing-title") != null ? document.querySelector("#listing-title").innerHTML : null; })];
                    case 2:
                        title = _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return Array.from(document.querySelectorAll(".listings-slider-image"), function (element) { return element.getAttribute('src'); }); })];
                    case 3:
                        images = _b.sent();
                        images = this.cleanImagesUrls(images);
                        return [4 /*yield*/, page.evaluate(function () {
                                var selector = document.querySelector("#listing-features .info-inner");
                                if (selector == null) {
                                    return null;
                                }
                                return selector.innerText;
                            })];
                    case 4:
                        propertyFeatures = _b.sent();
                        postDirectoryPath = path.join(this.getPostsDir(), title);
                        postDirectoryExists = fs.existsSync(postDirectoryPath);
                        if (postDirectoryExists === true) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.beds>.right") != null ? document.querySelector("#single-listing-propinfo>.beds>.right").textContent : null; })];
                    case 5:
                        beds = _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.baths>.right") != null ? document.querySelector("#single-listing-propinfo>.baths>.right").textContent : null; })];
                    case 6:
                        baths = _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.sqft>.right") != null ? document.querySelector("#single-listing-propinfo>.sqft>.right").textContent : null; })];
                    case 7:
                        size = _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.community>.right") != null ? document.querySelector("#single-listing-propinfo>.community>.right").textContent : null; })];
                    case 8:
                        floorNumber = _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector(".listing-price") != null ? document.querySelector(".listing-price").textContent : null; })];
                    case 9:
                        price = _b.sent();
                        price = price.replace('THB', '');
                        price = price.replace(',', '');
                        metadata = {
                            'title': title,
                            'url': pageUrl,
                            'beds': beds,
                            'baths': baths,
                            'size': size,
                            'floorNumber': floorNumber,
                            'price': price,
                            'features': propertyFeatures
                        };
                        console.log(metadata);
                        //save content
                        fs.mkdirSync(postDirectoryPath);
                        return [4 /*yield*/, this.processPropertyFeatures(metadata)];
                    case 10:
                        textContent = _b.sent();
                        fs.writeFileSync(path.join(postDirectoryPath, 'text.txt'), textContent);
                        this.writeJSONToFile(postDirectoryPath, 'metadata.json', metadata);
                        try {
                            //save images
                            for (images_1 = __values(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
                                imageUrl = images_1_1.value;
                                this.downloadImage(path.join(postDirectoryPath, ((new Date()).getTime() + '.jpg')), imageUrl);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (images_1_1 && !images_1_1.done && (_a = images_1.return)) _a.call(images_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    HotDogCondosImporter.prototype.writeJSONToFile = function (dirPath, fileName, content) {
        var encodedContent = JSON.stringify(content);
        return fs.writeFileSync(path.join(dirPath, fileName), encodedContent);
    };
    HotDogCondosImporter.prototype.getPostsDir = function () {
        var app = require('electron').app;
        return path.join(app.getPath('userData'), 'posts');
    };
    HotDogCondosImporter.prototype.downloadImage = function (imagePath, imageUrl) {
        https.request(imageUrl, function (response) {
            var data = new Stream();
            response.on('data', function (chunk) {
                data.push(chunk);
            });
            response.on('end', function () {
                fs.writeFileSync(imagePath, data.read());
            });
        }).end();
    };
    HotDogCondosImporter.prototype.cleanImagesUrls = function (imagesUrls) {
        var e_5, _a;
        var redefinedImagesUrl = [];
        try {
            for (var imagesUrls_1 = __values(imagesUrls), imagesUrls_1_1 = imagesUrls_1.next(); !imagesUrls_1_1.done; imagesUrls_1_1 = imagesUrls_1.next()) {
                var imageUrl = imagesUrls_1_1.value;
                var indexOfQuery = imageUrl.indexOf('?');
                var imageUrlWithNoQuery = imageUrl.substr(0, indexOfQuery);
                redefinedImagesUrl.push(imageUrlWithNoQuery);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (imagesUrls_1_1 && !imagesUrls_1_1.done && (_a = imagesUrls_1.return)) _a.call(imagesUrls_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return redefinedImagesUrl;
    };
    HotDogCondosImporter.prototype.scrapeListingURLS = function (page, pageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goto(pageUrl, { waitUntil: 'networkidle2' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return Array.from(document.querySelectorAll('.listing-featured-image'), function (element) { return element.getAttribute('href'); }); })];
                    case 2:
                        urls = _a.sent();
                        return [2 /*return*/, urls];
                }
            });
        });
    };
    HotDogCondosImporter.prototype.lunchBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                config = config_helper_1.ConfigHelper.getConfig();
                // if((ConfigHelper.getConfigValue('headless',false) ) === true){
                return [2 /*return*/, puppeteer.launch({
                        executablePath: config_helper_1.ConfigHelper.getConfigValue('chrome_executable_path'),
                        headless: config_helper_1.ConfigHelper.getConfigValue('headless', false),
                        defaultViewport: null,
                        args: ['--start-maximized', "--disable-notifications"]
                    })];
            });
        });
    };
    HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL = 'https://www.hotdogcondos.com';
    return HotDogCondosImporter;
}());
exports.HotDogCondosImporter = HotDogCondosImporter;
//# sourceMappingURL=hotdogcondos.importer.js.map