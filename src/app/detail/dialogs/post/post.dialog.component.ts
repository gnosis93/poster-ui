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

  public isLoading: boolean = false;
  private post: Post;
  private posts: Post[];
  public showSettings:boolean = false;

  private postsQueue:{'channel':Channel,'post':Post}[] = [];
  
  public loadingProgress: number = 0;
  public numberSelectedChannels: number = 0;

  public langues = [
    'english',
    'thai',
    'italian',
    'chinese'
  ]

  public readonly channels: Channel[] = [
    {
      "name": 'Facebook Pages',
      "selected": false,
    },
    {
      "name": 'Facebook Groups',
      "selected": false,
    },
    {
      "name": 'Craigslist',
      "selected": false,
      'cities': [
        {
          name: 'bangkok',
          selected: false
        },
        {
          name: 'beijing',
          selected: false
        },
        {
          name: 'shanghai',
          selected: false
        },
        {
          name: 'hong kong',
          selected: false
        },
        {
          name:'moscow',
          selected:false
        },
        {
          name:'st petersburg',
          selected:false
        },
        {
          name:'mumbai',
          selected:false
        },
        {
          name:'bologna',
          selected:false
        },
        {
          name:'rome',
          selected:false
        },
        {
          name:'firenze',
          selected:false
        },
        {
          name:'bangladesh',
          selected:false
        }
      ]
    }
  ];


  constructor(
    private dialogRef: MatDialogRef<PostDialogComponent>,
    private postsService: PostsService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private cd: ChangeDetectorRef
  ) {
    this.isLoading = false;

    this.post = data.post ?? null;
    this.posts = data.posts ?? (this.post ? [this.post] : null);

    if (!this.post && !this.posts) {
      this.dialogRef.close();
      alert('Invalid post')
    }

    this.postsService.postToFacebookPages(null).subscribe((result) => {
      // this.setChannelSelected('Facebook Pages', false);
      let thisPostIndex = this.postsQueue.findIndex((c) => c.channel.name == 'Facebook Pages');
      this.postsQueue = this.postsQueue.filter((p,i) => i != thisPostIndex);
      
      this.loadingProgress++;

      let selectedChannels = this.postsQueue;

      if (selectedChannels.length == 0) {
        return this.postingCompleted();
      } else {
        this.handleQueueItem(this.postsQueue[0].post,this.postsQueue[0].channel);
      }


      // if (result === false) {
      //   alert('An error has occurred while posting this post');
      // }

      this.cd.detectChanges();
    });

    this.postsService.postToFacebookGroups(null).subscribe((result) => {
      // this.setChannelSelected('Facebook Groups', false);
      let thisPostIndex = this.postsQueue.findIndex((c) => c.channel.name == 'Facebook Groups');
      this.postsQueue = this.postsQueue.filter((p,i) => i != thisPostIndex);
      
      this.loadingProgress++;

      let selectedChannels = this.postsQueue;

      if (selectedChannels.length == 0) {
        return this.postingCompleted();
      } else {
        this.handleQueueItem(this.postsQueue[0].post,this.postsQueue[0].channel);
      }

      // if (result === false) {
      //   alert('An error has occurred while posting this post to groups');
      // }

      this.cd.detectChanges();
    });


    this.postsService.postToCraigslist(null,null).subscribe((result) => {
      // this.setChannelSelected('Craigslist', false);
      let thisPostIndex = this.postsQueue.findIndex((c) => c.channel.name == 'Craigslist');
      this.postsQueue = this.postsQueue.filter((p,i) => i != thisPostIndex);
      
      this.loadingProgress++;

      let selectedChannels = this.postsQueue;

      // let selectedChannels = this.getSelectedChannels();
      if (selectedChannels.length == 0) {
        return this.postingCompleted();
      } else {
        this.handleQueueItem(this.postsQueue[0].post,this.postsQueue[0].channel);
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

  private postingCompleted() {
    this.isLoading = false;
    this.dialogRef.close();
    this.cd.detectChanges();
    // alert('Operation Completed')
  }

  async close() {
    this.dialogRef.close();
    this.cd.detectChanges();
    console.log('post dialog closed');
  }


  handleQueueItem(post:Post,channel: Channel) {
   
    this.postsQueue.push({
      channel:channel,
      post:post
    });

    switch (channel.name) {
      case 'Facebook Pages':
        this.postsService.postToFacebookPages(post);
        break;
      case 'Facebook Groups':
        this.postsService.postToFacebookGroups(post);
        break;
      case 'Craigslist':
        let selectedCities = channel.cities.filter(s => s.selected);
        for (let city of selectedCities) {
          this.postsService.postToCraigslist(post, city.name);
        }
        break;

    }
  }

  public setChannelSelected(channelName: string, selectedValue: boolean) {
    for (let channel of this.channels) {
      if (channel.name === channelName) {
        channel.selected = selectedValue;
        return true;
      }
    }
    return false;
  }

  private async validateChannels() {
    let selectedChannels = this.getSelectedChannels();
    let result = true;
    for (let channel of selectedChannels) {
      switch (channel.name) {
        case 'Facebook Pages':
          result = await this.validateFacebookPageConfig()
          if (result == false) {
            return result;
          }
          break;
        case 'Facebook Groups':
          result = await this.validateFacebookGroupConfig()
          if (result == false) {
            return result;
          }
          break;
        case 'Craigslist':
          result = await this.validateCraigslistConfig()
          if (result == false) {
            return result;
          }
          if (channel.cities.find((c) => c.selected == true) == null) {
            alert('Please select at least one city!')
            return false
          }
          break;
      }
    }
    return result;
  }

  private async validateFacebookPageConfig() {
    if (await this.configService.validateFacebookCredentials() === false) {
      alert('Facebook Email/Password are not set or incorrect');
      return false;
    }

    let configPages = (await this.configService.getConfigValue<Array<string>>('facebook_pages'));
    if (Array.isArray(configPages) === false) {
      alert('Facebook Pages are not valid in Config');
      return false;
    }
    if (configPages.length == 0) {
      alert('Facebook Pages are not valid in Config');
      return false;
    }

    return true;
  }

  private async validateCraigslistConfig() {
    if (await this.configService.validateCraigslistCredentials() === false) {
      alert('Craigslist Email/Password are not set or incorrect');
      return false;
    }
    let phoneNumber = (await this.configService.getConfigValue<string | null>('phone_number'));
    if (phoneNumber == null || phoneNumber.length == 0) {
      alert('Phone number in config is required, Please set it up');
      return false;
    }

    let phoneExtension = (await this.configService.getConfigValue<string | null>('phone_number'));
    if (phoneExtension == null || phoneExtension.length == 0) {
      alert('Phone extension in config is required, Please set it up');
      return false;
    }

    return true;
  }

  private async validateFacebookGroupConfig() {
    if (await this.configService.validateFacebookCredentials() === false) {
      alert('Facebook Email/Password are not set or incorrect');
      return false;
    }

    let configPages = (await this.configService.getConfigValue<Array<string>>('facebook_groups'));
    if (Array.isArray(configPages) === false) {
      alert('Facebook Groups are not valid in Config');
      return false;
    }
    if (configPages.length == 0) {
      alert('Facebook Groups are not valid in Config');
      return false;
    }
    return true;
  }



  
  private getSelectedChannels(): Channel[] {
    return this.channels.filter((channel) => channel.selected === true);
  }

  async onPostClick() {
    // this.numberSelectedChannels = selectedChannels.length;
    this.numberSelectedChannels = 0;
    let selectedChannels = this.getSelectedChannels();


    if (selectedChannels.length == 0) {
      this.isLoading = false;
      alert('Please Select at least 1 channel');
    }

    if (await this.validateChannels() === false) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    for(let post of this.posts){
      this.numberSelectedChannels++;
      for(let selectedChannel of selectedChannels){
        this.handleQueueItem(post,selectedChannel);
      }
    }
    // this.channelPostingQueue;
  }
}


interface Channel { name: string, selected: boolean, cities?: Array<{ name: string, selected: boolean }> };
