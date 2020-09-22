import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private $postsSubject:Subject<Post[]>;
  private $postSubject:Subject<Post>;
  private $postToFacebookPagesSubject:Subject<boolean>;
  private $deleteSubject:Subject<boolean>;
  private $deleteAllPostsSubject:Subject<boolean>;
  private $postToFacebookGroupsSubject:Subject<boolean>;
  private $postToCraigslistSubject:Subject<boolean>;

  constructor(
    private electron: ElectronService,
  ) {

    this.$postsSubject                = new Subject<Post[]>();
    this.$postSubject                 = new Subject<Post>();
    this.$postToFacebookPagesSubject  = new Subject<boolean>();
    this.$postToFacebookGroupsSubject = new Subject<boolean>();
    this.$postToCraigslistSubject     = new Subject<boolean>();
    this.$deleteAllPostsSubject       = new Subject<boolean>();
    this.$deleteSubject               = new Subject<boolean>();

    this.electron.ipcRenderer.addListener('getPostByName',(sender,message)=>{
      this.$postSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('deletePostByName',(sender,message)=>{
      this.$deleteSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('getPosts',(sender,message)=>{
        this.$postsSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('submitPostToFacebookPages',(sender,message)=>{
      this.$postToFacebookPagesSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('submitPostToFacebookGroups',(sender,message)=>{
      this.$postToFacebookGroupsSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('postToCraigslistSubject',(sender,message)=>{
      this.$postToCraigslistSubject.next(message);
    });   
    
    this.electron.ipcRenderer.addListener('deleteAllPosts',(sender,message)=>{
      this.$deleteAllPostsSubject.next(true);
    });




  }


  public get Posts(){
    this.electron.ipcRenderer.send('getPosts');
    return this.$postsSubject.asObservable();
  }

  public deletePostByName(postName:string | null){
    if(postName != null){
      this.electron.ipcRenderer.send('deletePostByName',postName);
    }
    return this.$deleteSubject.asObservable();
  }

  public deleteAllPosts(deleteAllNow=false){
    if(deleteAllNow === true){
      this.electron.ipcRenderer.send('deleteAllPosts');
    }
    return this.$deleteAllPostsSubject.asObservable();
  }

  public getPostByName(postName:string | null){
    if(postName != null){
      this.electron.ipcRenderer.send('getPostByName',postName);
    }
    return this.$postSubject.asObservable();
  }


  public postToFacebookPages(post:Post | null){
    if(post != null){
      this.electron.ipcRenderer.send('submitPostToFacebookPages',post);
    }
    return this.$postToFacebookPagesSubject.asObservable();
  }

  public postToFacebookGroups(post:Post | null){
    if(post != null){
      this.electron.ipcRenderer.send('submitPostToFacebookGroups',post);
    }
    return this.$postToFacebookGroupsSubject.asObservable();
  }

  public postToCraigslist(post:Post | null,city:string){
    if(post != null){
      this.electron.ipcRenderer.send('submitPostToCraigslist',post,city);
    }
    return this.$postToCraigslistSubject.asObservable();
  }



}

export interface Post{
  name    : string,
  dirPath : string,
  images  : PostImage[] ,
  content : string,
  metaData:PostMetaData|null


}
export interface PostImage{
  imageURL: string,
  selected:boolean
}

export interface PostMetaData{
  'title'      : string,
  'url'        : string,
  'beds'       : number,
  'baths'      : number,
  'size'       : string,
  'floorNumber': string
  'price': string
}