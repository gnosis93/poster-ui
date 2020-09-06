import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'app/core/services';
import {Post} from '../../poster/models/post.interface';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from 'app/shared/components/progress-spinner-dialog/progress-spinner-dialog.component';
import { Observable } from 'rxjs';
import {ConfigDialogComponent} from '../shared/components/config-dialog/config-dialog.component';
import { PostsService } from 'app/shared/services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts:Post[];
  private loadingDialogRef:MatDialogRef<ProgressSpinnerDialogComponent, any>|null = null;

  constructor(
    private router: Router,
    private electron: ElectronService,
    private dialog: MatDialog,
    private zone:NgZone,
    private postsService:PostsService
  ) { }

  ngOnInit(): void {
    this.getPosts();

    // this.electron.ipcRenderer.addListener('getPosts',(sender,message)=>{
    //   this.zone.run(()=>{
    //     console.log('response ',sender,message);
    //     this.posts = Array.from(message);
    //     if(this.loadingDialogRef){
    //       this.loadingDialogRef.close();
    //     }
    //     // this.cdRef.detectChanges();
    //   });

    // });



    this.electron.ipcRenderer.addListener('websiteImport',(sender,message)=>{
      // console.log('response ',sender,message);
      // this.posts = message;
      // this.cdRef.detectChanges();
      this.zone.run(()=>{
        if(this.loadingDialogRef){
          this.loadingDialogRef.close();
        }
        console.log('ok');
        this.getPosts();
        // this.testFunc()
     });

    });

  }



  getPosts(){
    this.showProgressSpinner();
    this.postsService.Posts.subscribe((posts)=>{
      this.posts = posts;
      if(this.loadingDialogRef){
        this.loadingDialogRef.close();
      }
    })
    // this.posts = [
    //   {
    //     "content": "POST sadsadm",
    //     "dirPath": "/home/aaron/posts/post-1",
    //     "images":[

    //     ],
    //     "name": "post 1"
    //   },
    //   {
    //     "content": "POST sadsadm",
    //     "dirPath": "/home/aaron/posts/post-1",
    //     "images":[

    //     ],
    //     "name": "ASA post 1"
    //   },
    //   {
    //     "content": "POST sadsadm",
    //     "dirPath": "/home/aaron/posts/post-1",
    //     "images":[

    //     ],
    //     "name": "aaa OOOost-1"
    //   },
    //   {
    //     "content": "POST sadsadm",
    //     "dirPath": "/home/aaron/posts/post-1",
    //     "images":[

    //     ],
    //     "name": "AA post-1"
    //   },
    //   {
    //     "content": "POST sadsadm",
    //     "dirPath": "/home/aaron/posts/post-1",
    //     "images":[

    //     ],
    //     "name": "post-1"
    //   }
    // ]
    // this.cdRef.detectChanges();


  }

  async onImportClick(){
    this.showProgressSpinner();
    this.electron.ipcRenderer.send('websiteImport');

  }

  async onConfigClick(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
    };

    this.dialog.open(ConfigDialogComponent, dialogConfig);
  }

  async onPostClick(post:Post|null){
    if(!post || !post.name || post.name.length == 0){
      return;
    }
    this.router.navigateByUrl('/detail/'+post.name);
  }

  showProgressSpinner(){
    if(this.loadingDialogRef !== null){
      this.loadingDialogRef.close();
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
    };

    this.loadingDialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    return this.loadingDialogRef ;
  }


}
