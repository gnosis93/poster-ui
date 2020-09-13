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
  private $postToFacebookGroupsSubject:Subject<boolean>;

  constructor(
    private electron: ElectronService,
  ) {

    this.$postsSubject                = new Subject<Post[]>();
    this.$postSubject                 = new Subject<Post>();
    this.$postToFacebookPagesSubject  = new Subject<boolean>();
    this.$postToFacebookGroupsSubject = new Subject<boolean>();
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
}

export interface Post{
  name    : string,
  dirPath : string,
  images  : PostImage[] ,
  content : string

}
export interface PostImage{
  imageURL: string,
  selected:boolean
}
