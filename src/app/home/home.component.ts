import { Component, OnInit, ChangeDetectorRef, NgZone, ElementRef } from '@angular/core';
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
import { PostDialogComponent } from '../detail/dialogs/post/post.dialog.component'

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

    this.postsService.deleteAllPosts(false).subscribe((result)=>{
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
  
  onRandomSelectClick(numberOfRandomElemInput){
    if(!numberOfRandomElemInput){
      return alert('error');
    }

    let value = numberOfRandomElemInput.value ?? null;
    if(isNaN(value) || value < 1 || value > 30 || value > this.posts.length){
      return alert('Invalid number of random posts given. Value should be between 1 - 30');
    }
    
    //unselect any post
    for(let postIndex in this.posts){
        this.posts[postIndex].selected = false;
    }

    let selectedRandomIndexes = [];
    for(let i = 0; i <= value;i++){
      let randomIndex =  this.getRandomArbitrary(0,this.posts.length);//Math.floor((Math.random() * this.posts.length) + 1); ;
      while(selectedRandomIndexes.includes(randomIndex)){
        randomIndex =  this.getRandomArbitrary(0,this.posts.length);//Math.floor((Math.random() * this.posts.length) + 1); ;
      }
      selectedRandomIndexes.push(randomIndex);
    }

    for(let randomIndex of selectedRandomIndexes){
      this.posts[randomIndex].selected = true;
    }
  }
  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   */
  private getRandomArbitrary(min, max) {
    // return Math.floor(Math.random() * (max - min) + min);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async onPostSelected(){
    const dialogPost = new MatDialogConfig();

    dialogPost.disableClose = false;
    dialogPost.autoFocus = true;

    let selectedPosts = this.posts.filter((p) => typeof p.selected != 'undefined' && p.selected === true);
    dialogPost.data = {
      posts:selectedPosts
    };
    
    console.log('no error')

    this.dialog.open(PostDialogComponent, dialogPost);

  }
  
  async onDeleteAllPosts(){
    if(confirm('Are you sure you want delete all the posts ?') === false){
      return;
    }
    this.showProgressSpinner();
    this.postsService.deleteAllPosts(true);
  }

  async onImportClick(){
    let validExcPathInConfig = await this.configService.validateConfigExecutablePath()
    if(validExcPathInConfig === false){
      alert('Executable Path is not set in config, Please set it up');
      return;
    }

    this.showProgressSpinner();
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
