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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotDogCondosImporter = void 0;
var puppeteer = require("puppeteer");
var path = require("path");
var fs = require("fs");
var https = require("https");
var config_helper_1 = require("../helpers/config.helper");
var Stream = require('stream').Transform;
var HotDogCondosImporter = /** @class */ (function () {
    function HotDogCondosImporter() {
    }
    HotDogCondosImporter.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var browser, mainPage, pagesUrls, propertiesUrls, _i, pagesUrls_1, pageUrl, pagePropertiesUrls, _a, propertiesUrls_1, propertyUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.lunchBrowser()];
                    case 1:
                        browser = _b.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        mainPage = _b.sent();
                        return [4 /*yield*/, this.scrapePagesUrls(mainPage)];
                    case 3:
                        pagesUrls = _b.sent();
                        propertiesUrls = [];
                        _i = 0, pagesUrls_1 = pagesUrls;
                        _b.label = 4;
                    case 4:
                        if (!(_i < pagesUrls_1.length)) return [3 /*break*/, 7];
                        pageUrl = pagesUrls_1[_i];
                        return [4 /*yield*/, this.scrapeListingURLS(mainPage, pageUrl)];
                    case 5:
                        pagePropertiesUrls = _b.sent();
                        propertiesUrls = propertiesUrls.concat(pagePropertiesUrls);
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        _a = 0, propertiesUrls_1 = propertiesUrls;
                        _b.label = 8;
                    case 8:
                        if (!(_a < propertiesUrls_1.length)) return [3 /*break*/, 11];
                        propertyUrl = propertiesUrls_1[_a];
                        return [4 /*yield*/, this.scrapeProperty(propertyUrl, mainPage)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        _a++;
                        return [3 /*break*/, 8];
                    case 11: 
                    // if((ConfigHelper.getConfigValue('headless',false) ) === true){
                    return [4 /*yield*/, browser.close()];
                    case 12:
                        // if((ConfigHelper.getConfigValue('headless',false) ) === true){
                        _b.sent();
                        // }
                        // this.scrapeListingURLS(browser,HotDogCondosImporter.HOTDOGCONDOS_WEBSITE_URL);
                        return [2 /*return*/, true];
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
                text = propertyMetaData.title + " is a new project that can be a great new investment opportunity or a place to call home . Located in Pattaya a highly touristic city with all the amentias you can imagine ! \nMore info at : " + propertyMetaData.url + "\nProperty Features: \n" + propertyMetaData.features + "\n\nCall for view:  " + (config_helper_1.ConfigHelper.getConfigValue('phone_extension') + ' ' + config_helper_1.ConfigHelper.getConfigValue('phone_number')) + "\n        ";
                return [2 /*return*/, text];
            });
        });
    };
    HotDogCondosImporter.prototype.scrapeProperty = function (pageUrl, page) {
        return __awaiter(this, void 0, void 0, function () {
            var title, images, propertyFeatures, postDirectoryPath, postDirectoryExists, beds, baths, size, floorNumber, price, metadata, textContent, _i, images_1, imageUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // let page    = await browser.newPage();
                    return [4 /*yield*/, page.goto(pageUrl, { waitUntil: 'networkidle2' })];
                    case 1:
                        // let page    = await browser.newPage();
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#listing-title") != null ? document.querySelector("#listing-title").innerHTML : null; })];
                    case 2:
                        title = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return Array.from(document.querySelectorAll(".listings-slider-image"), function (element) { return element.getAttribute('src'); }); })];
                    case 3:
                        images = _a.sent();
                        images = this.cleanImagesUrls(images);
                        return [4 /*yield*/, page.evaluate(function () {
                                var selector = document.querySelector("#listing-features .info-inner");
                                if (selector == null) {
                                    return null;
                                }
                                return selector.innerText;
                            })];
                    case 4:
                        propertyFeatures = _a.sent();
                        postDirectoryPath = path.join(this.getPostsDir(), title);
                        postDirectoryExists = fs.existsSync(postDirectoryPath);
                        if (postDirectoryExists === true) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.beds>.right") != null ? document.querySelector("#single-listing-propinfo>.beds>.right").textContent : null; })];
                    case 5:
                        beds = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.baths>.right") != null ? document.querySelector("#single-listing-propinfo>.baths>.right").textContent : null; })];
                    case 6:
                        baths = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.sqft>.right") != null ? document.querySelector("#single-listing-propinfo>.sqft>.right").textContent : null; })];
                    case 7:
                        size = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector("#single-listing-propinfo>.community>.right") != null ? document.querySelector("#single-listing-propinfo>.community>.right").textContent : null; })];
                    case 8:
                        floorNumber = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector(".listing-price") != null ? document.querySelector(".listing-price").textContent : null; })];
                    case 9:
                        price = _a.sent();
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
                        textContent = _a.sent();
                        fs.writeFileSync(path.join(postDirectoryPath, 'text.txt'), textContent);
                        this.writeJSONToFile(postDirectoryPath, 'metadata.json', metadata);
                        //save images
                        for (_i = 0, images_1 = images; _i < images_1.length; _i++) {
                            imageUrl = images_1[_i];
                            this.downloadImage(path.join(postDirectoryPath, ((new Date()).getTime() + '.jpg')), imageUrl);
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
        var redefinedImagesUrl = [];
        for (var _i = 0, imagesUrls_1 = imagesUrls; _i < imagesUrls_1.length; _i++) {
            var imageUrl = imagesUrls_1[_i];
            var indexOfQuery = imageUrl.indexOf('?');
            var imageUrlWithNoQuery = imageUrl.substr(0, indexOfQuery);
            redefinedImagesUrl.push(imageUrlWithNoQuery);
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