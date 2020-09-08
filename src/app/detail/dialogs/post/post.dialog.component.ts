import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService, Post } from 'app/shared/services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.dialog.component.html',
  styleUrls: ['./post.dialog.component.scss']
})
export class PostDialogComponent implements OnInit {

  public isLoading:boolean = false;
  private post:Post;


  public loadingProgress:number = 0;
  public numberSelectedChannels:number = 0;

  public readonly channels:Channel[] = [
    {
      "name":'Facebook Pages',
      "selected":false,
    },
    {
      "name":'Facebook Groups',
      "selected":false,
    }
  ];


  constructor(
    private dialogRef:MatDialogRef<PostDialogComponent>,
    private postsService: PostsService,
    @Inject(MAT_DIALOG_DATA) data:any,
    private cd: ChangeDetectorRef
    ) { 

    this.post = data.post ?? null;
    if(!this.post){
      this.dialogRef.close();
      alert('Invalid post')
    }

  }

  ngOnInit(): void {
    this.isLoading = false;


    this.postsService.postToFacebookPages(null).subscribe((result) => {
      this.setChannelSelected('Facebook Pages',false);

      let selectedChannels = this.getSelectedChannels();
      
      if(selectedChannels.length > 0){
        this.handleQueueItem(selectedChannels[0]);
      }else{
        this.postingCompleted();
      }

      this.loadingProgress++;

      if (result === false) {
        alert('An error has occurred while posting this post');
      }

      this.cd.detectChanges();
    });

    this.postsService.postToFacebookGroups(null).subscribe((result) => {
      this.setChannelSelected('Facebook Groups',false);

      let selectedChannels = this.getSelectedChannels();
      if(selectedChannels.length > 0){
        this.handleQueueItem(selectedChannels[0]);
      }else{
        this.postingCompleted();
      }
      
      this.loadingProgress++;
      
      if (result === false) {
        alert('An error has occurred while posting this post to groups');
      }

      this.cd.detectChanges();
    });
  }

  private postingCompleted(){
    this.isLoading = false;
    alert('Operation Completed')
    this.dialogRef.close();
    console.log('Operation Completed')
  }

  close(){
    this.dialogRef.close();
  }


  handleQueueItem(channel:Channel){
    switch(channel.name){
      case 'Facebook Pages':
        this.postsService.postToFacebookPages(this.post);
        break;
      case 'Facebook Groups':
        this.postsService.postToFacebookGroups(this.post);
        break;

    }
  }

  public setChannelSelected(channelName:string,selectedValue:boolean){
    for(let channel of this.channels){
      if(channel.name === channelName){
        channel.selected = selectedValue;
        return true;
      }
    }
    return false;
  }

  private getSelectedChannels():Channel[]{
    return this.channels.filter((channel) => channel.selected === true);
  }

  onPostClick(){
    let selectedChannels        = this.getSelectedChannels();
    this.numberSelectedChannels = selectedChannels.length;
    
    if(selectedChannels.length > 0){
      this.isLoading = true;
      this.handleQueueItem(selectedChannels[0]);
    }else{
      alert('Please Select at least 1 channel');
    }
    // this.channelPostingQueue;
  }
}


interface Channel{name:string,selected:boolean};