import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'app/core/services';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from 'app/shared/components/progress-spinner-dialog/progress-spinner-dialog.component';
import { Observable, Subscription } from 'rxjs';
import {ConfigDialogComponent} from '../shared/components/config-dialog/config-dialog.component';
import { PostsService, Post } from 'app/shared/services/posts.service';
import { allowedNodeEnvironmentFlags } from 'process';
import { ImportService } from 'app/shared/services/import.service';
import { ConfigService } from 'app/shared/services/config.service';
import { Config } from 'electron/main';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts:Post[];
  private loadingDialogRef:MatDialogRef<ProgressSpinnerDialogComponent, any>|null = null;
  private deleteSubscription:Subscription|null = null;
  private config:any;

  constructor(
    private router: Router,
    // private electron: ElectronService,
    private dialog: MatDialog,
    private zone:NgZone,
    private postsService:PostsService,
    private importService:ImportService,
    private configService: ConfigService
  ) { }


  ngOnInit(): void {
    this.getPosts();
    this.importService.importHotdogCondos(false).subscribe((result)=>{
      this.hideSpinner();
      this.getPosts();
    });

    this.configService.getConfig().subscribe((config)=>this.config = config);
  }

  hideSpinner(){
    this.zone.run(()=>{
      if(this.loadingDialogRef){
        this.loadingDialogRef.close();
      }
    })
  }

  getPosts(){
    this.showProgressSpinner();
    this.postsService.Posts.subscribe((posts)=>{
      this.posts = posts;
      this.hideSpinner();
    })
  }

  async onImportClick(){
    let validExcPathInConfig = await this.configService.validateConfigExecutablePath()
    if(validExcPathInConfig === false){
      alert('Executable Path is not set in config, Please set it up');
      return;
    }
    
    this.importService.importHotdogCondos();
      
  }
  
  async onDeleteClick(post:Post|null){
    if(!post || !post.name || post.name.length == 0){
      return;
    }
    if(confirm('Are you sure to delete ' + post.name + '?')){
      this.showProgressSpinner();
      
      if(!this.deleteSubscription){
        this.deleteSubscription = this.postsService.deletePostByName(post.name).subscribe((response)=>{
          console.log('deleted on renderer received response ok')
          if(response){
            this.getPosts();
          }else{
            alert('Unexpected error occurred while deleting this item. Please, contact support.');
          }
        })
      }else{
        this.postsService.deletePostByName(post.name);
      }
    }
    
  }

  async onConfigClick(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
    };

    this.dialog.open(ConfigDialogComponent, dialogConfig);
  }

  async onSelectClick(post:Post|null){
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
