import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'app/core/services';
import { Post } from 'poster/models/post.interface';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from 'app/shared/components/progress-spinner-dialog/progress-spinner-dialog.component';

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
    private electron: ElectronService,
    private zone:NgZone,
    private router:Router,
    private dialog: MatDialog
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

    this.electron.ipcRenderer.addListener('getPostByName',(sender,message)=>{
      this.zone.run(()=>{
        if(this.loadingDialogRef){
          this.loadingDialogRef.close();
        }
        this.post = message;
        console.log(this.post);
      })
    });

    this.electron.ipcRenderer.addListener('submitPostToFacebookPages',(sender,message)=>{
      if(this.loadingDialogRef){
        this.loadingDialogRef.close();
      }
    });
  }
  
  public onPostClick(){
    this.showProgressSpinner();
    this.electron.ipcRenderer.send('submitPostToFacebookPages',this.post);
  }

  private getPost(postName:string){
    this.showProgressSpinner();
    return this.electron.ipcRenderer.send('getPostByName',postName);
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
