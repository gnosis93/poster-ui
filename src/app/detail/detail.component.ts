import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'app/core/services';
import { Post } from 'poster/models/post.interface';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from 'app/shared/components/progress-spinner-dialog/progress-spinner-dialog.component';
import { PostsService } from 'app/shared/services/posts.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public post:Post|null = null;

  private loadingDialogRef:MatDialogRef<ProgressSpinnerDialogComponent, any>|null = null;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private dialog: MatDialog,
    private postsService:PostsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      let postName = params['postName'] ?? null;
      if(!postName){
        this.router.navigateByUrl('/');
        alert('Post not found');
      }else{
        this.getPost(postName);
      }
    })


    this.postsService.postToFacebookPages(null).subscribe((result)=>{
      if(this.loadingDialogRef){
        this.loadingDialogRef.close();
      }
      if(result === false){
        alert('An error has occurred while posting this post');
      }
    });

  }

  public onPostClick(){
    this.showProgressSpinner();
    this.postsService.postToFacebookPages(this.post);
  }

  private getPost(postName:string){
    this.showProgressSpinner();
    this.postsService.getPostByName(postName).subscribe((post)=>{
      this.post = post;
      if(this.loadingDialogRef){
        this.loadingDialogRef.close();
      }
    })
    // getPostByName
  }


  private showProgressSpinner(){
    if(this.loadingDialogRef !== null){
      this.loadingDialogRef.close();
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
    };

    this.loadingDialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    return this.loadingDialogRef;
  }
}
