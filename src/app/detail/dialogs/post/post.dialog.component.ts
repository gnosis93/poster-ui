import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService, Post } from 'app/shared/services/posts.service';
import { ConfigService } from 'app/shared/services/config.service';

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
    private configService:ConfigService,
    @Inject(MAT_DIALOG_DATA) data:any,
    private cd: ChangeDetectorRef
    ) {
      this.isLoading = false;

      this.post = data.post ?? null;
      if(!this.post){
        this.dialogRef.close();
        alert('Invalid post')
      }

      this.postsService.postToFacebookPages(null).subscribe((result) => {
        this.setChannelSelected('Facebook Pages',false);
        this.loadingProgress++;

        let selectedChannels = this.getSelectedChannels();

        if(selectedChannels.length == 0){
          return this.postingCompleted();
        }else{
          this.handleQueueItem(selectedChannels[0]);
        }


        // if (result === false) {
        //   alert('An error has occurred while posting this post');
        // }

        this.cd.detectChanges();
      });

      this.postsService.postToFacebookGroups(null).subscribe((result) => {
        this.setChannelSelected('Facebook Groups',false);
        this.loadingProgress++;

        let selectedChannels = this.getSelectedChannels();
        if(selectedChannels.length == 0){
          return this.postingCompleted();
        }else{
          this.handleQueueItem(selectedChannels[0]);
        }

        // if (result === false) {
        //   alert('An error has occurred while posting this post to groups');
        // }

        this.cd.detectChanges();
      });

  }

  ngOnInit(): void {
    this.isLoading = false;



  }

  private  postingCompleted(){
    this.isLoading = false;
    this.dialogRef.close();
    this.cd.detectChanges();
    // alert('Operation Completed')
  }

  async close(){
    this.dialogRef.close();
    this.cd.detectChanges();
    console.log('post dialog closed');
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

  private async validateChannels(){
    let selectedChannels = this.getSelectedChannels();
    let result = true;
    for(let channel of selectedChannels){
      switch(channel.name){
          case 'Facebook Pages':
            result = await this.validateFacebookPageConfig()
            if(result == false){
              return result;
            }
          break;
          case 'Facebook Groups':
            result =  await this.validateFacebookGroupConfig()
            if(result == false){
              return result;
            }

          break;
      }

    }
    return result;
  }

  private async validateFacebookPageConfig(){
    if(await this.configService.validateFacebookCredentials() === false){
      alert('Facebook Email/Password are not set or incorrect');
      return false;
    }

    let configPages= (await this.configService.getConfigValue<Array<string>>('facebook_pages'));
    if(Array.isArray(configPages) === false){
      alert('Facebook Pages are not valid in Config');
      return false;
    }
    if(configPages.length == 0){
      alert('Facebook Pages are not valid in Config');
      return false;
    }

    return true;
  }

  private async validateFacebookGroupConfig(){
    if(await this.configService.validateFacebookCredentials() === false){
      alert('Facebook Email/Password are not set or incorrect');
      return false;
    }

    let configPages= (await this.configService.getConfigValue<Array<string>>('facebook_groups'));
    if(Array.isArray(configPages) === false){
      alert('Facebook Groups are not valid in Config');
      return false;
    }
    if(configPages.length == 0){
      alert('Facebook Groups are not valid in Config');
      return false;
    }
    return true;
  }

  private getSelectedChannels():Channel[]{
    return this.channels.filter((channel) => channel.selected === true);
  }

  async onPostClick(){
    let selectedChannels        = this.getSelectedChannels();
    this.numberSelectedChannels = selectedChannels.length;


    if(selectedChannels.length == 0){
      this.isLoading = false;
      alert('Please Select at least 1 channel');
    }

    if(await this.validateChannels() === false){
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.handleQueueItem(selectedChannels[0]);
    // this.channelPostingQueue;
  }
}


interface Channel{name:string,selected:boolean};
