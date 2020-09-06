import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';
import { Post } from 'poster/models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private $postsSubject:Subject<Post[]>;

  public get Posts(){
    this.electron.ipcRenderer.send('getPosts');
    return this.$postsSubject.asObservable();
  }


  constructor(
    private electron: ElectronService,
  ) {

    this.$postsSubject = new Subject<Post[]>();

    this.electron.ipcRenderer.addListener('getPosts',(sender,message)=>{
        console.log('response ',sender,message);
        this.$postsSubject.next(message);
        // this.posts = Array.from(message);
    });

  }
}
