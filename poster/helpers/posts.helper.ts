//importing necessary modules
import path = require('path');
import fs   = require('fs');
import {Post} from '../models/post.interface';
import { dir } from 'console';

export class PostsHelper{
    
    public static readonly CONTENT_FILE_NAME = 'text.txt';

    public static readonly ACCEPTED_IMAGES = [
        'jpg','jpeg','png','gif'
    ];

    public static getPostsDir(){
        const {app} = require('electron');
        const homedir = app.getPath('userData');
        let dirPath   = path.join(homedir, 'posts');
        return dirPath;
    }

   
    public static getListOfPosts(){
        let dirPath = this.getPostsDir();

        if(fs.existsSync(dirPath) === false){
            let errMsg = "Posts directory does not exist!! "+dirPath;
            console.error(errMsg);
            throw errMsg;
        }
        
        // let result = fs.readdirSync(dirPath); 
      
        //filter all files and directories to only directories
        const directoriesInPostsDir = fs.readdirSync(dirPath).filter(f => fs.statSync(path.join(dirPath, f)).isDirectory())

        return {
            'postsDirs':directoriesInPostsDir,
            'postsDirPath' : dirPath
        };
    }

    public static redefineListOfPosts(posts:Array<string>,postsDirPath:string):Post[]{
        let redefinedPosts = [];
        for(let postDirName of posts){
            let redefined = PostsHelper.getPostByName(postDirName,postsDirPath);
            redefinedPosts.push(redefined);
        }
        return redefinedPosts;
    }

    public static getPostByName(postDirName,postsDirPath:string=null):Post{
        if(postsDirPath === null){
          postsDirPath= this.getPostsDir();
        }
        let dirPath = path.join(postsDirPath, postDirName);
        let redefined = {
            name    : postDirName,
            dirPath : dirPath,
            images  : PostsHelper.getPostImages(dirPath) ,
            content : PostsHelper.getPostContent(dirPath)
        }
        return redefined;
    }

    public static deletePostByName(postDirName,postsDirPath:string=null):boolean{
        if(postsDirPath === null){
          postsDirPath= this.getPostsDir();
        }

        let result = true;
        let dirName = path.join(postsDirPath, postDirName);
        if(fs.existsSync(dirName) === true){
            fs.rmdirSync(dirName,{ recursive: true });
        }
        
        //     let posts = this.getListOfPosts();
        //     return this.redefineListOfPosts(posts.postsDirs, posts.postsDirPath);
        return result;
    }

    public static getPostContent(postDirPath:string):string{
        let contentFilePath = path.join(postDirPath,PostsHelper.CONTENT_FILE_NAME);
        if(fs.existsSync(contentFilePath) === false){
            let errMsg = "Posts Content file does not exist!! "+contentFilePath;
            console.error(errMsg);
            throw errMsg;
        }
        
        return fs.readFileSync(contentFilePath).toString();
    }

    public static getPostImages(postDirPath:string):string[]{
        if(fs.existsSync(postDirPath) === false){
            let errMsg = "Posts directory does not exist!! "+postDirPath;
            console.error(errMsg);
            throw errMsg;
        }
        
        let filesInDir = fs.readdirSync(postDirPath); 
        let imageFiles = Array();
        for(let file of filesInDir ){
            
            if(!file || file.indexOf('.') === -1){
                continue;
            }
            
            let fileNameExploded = file.split('.');
            let fileExtension    = fileNameExploded.length > 1 ? fileNameExploded[fileNameExploded.length-1] : null;
            if(!fileExtension || PostsHelper.ACCEPTED_IMAGES.indexOf(String(fileExtension)) === -1 ){
                continue;
            }

            imageFiles.push(path.join(postDirPath,file));
        }

        return imageFiles;
    }
}