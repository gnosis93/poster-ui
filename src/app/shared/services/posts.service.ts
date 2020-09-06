import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';
import { Post } from 'poster/models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private $postsSubject:Subject<Post[]>;
  private $postSubject:Subject<Post>;
  private $postToFacebookPagesSubject:Subject<boolean>;

  public get Delete(){
    this.electron.ipcRenderer.send('deletePostByName');
    return this.$postsSubject.asObservable();
  }


  constructor(
    private electron: ElectronService,
  ) {

    this.$postsSubject                = new Subject<Post[]>();
    this.$postSubject                 = new Subject<Post>();
    this.$postToFacebookPagesSubject  = new Subject<boolean>();

    this.electron.ipcRenderer.addListener('getPostByName',(sender,message)=>{
      this.$postSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('getPosts',(sender,message)=>{
        this.$postsSubject.next(message);
    });

    this.electron.ipcRenderer.addListener('submitPostToFacebookPages',(sender,message)=>{
      this.$postToFacebookPagesSubject.next(message);
    });

  }


  public get Posts(){
    this.electron.ipcRenderer.send('getPosts');
    return this.$postsSubject.asObservable();
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


}
