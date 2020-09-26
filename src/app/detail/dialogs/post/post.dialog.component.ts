import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService, Post } from 'app/shared/services/posts.service';
import { ConfigService } from 'app/shared/services/config.service';
import { CommonConstants } from 'app/shared/common-const';
import { config } from 'process';

@Component({
  selector: 'app-post',
  templateUrl: './post.dialog.component.html',
  styleUrls: ['./post.dialog.component.scss']
})
export class PostDialogComponent implements OnInit {

  public  isLoading: boolean = false;
  private post: Post;
  private posts: Post[];
  public  showSettings:boolean = false;

  private postsQueue:{'channel':Channel,'post':Post}[] = [];
  
  public loadingProgress: number = 0;
  public numberSelectedChannels: number = 0;

  public languages = CommonConstants.languages;

  public readonly channels: Channel[] = [
    // {
    //   "name": 'Facebook Pages',
    //   "selected": false,
    // },
    // {
    //   "name": 'Facebook Groups',
    //   "selected": false,
    // },
    {
      "name": 'Craigslist',
      "selected": true,
      'cities': [
        {
          name: 'bangkok',
          selected: true,
          lang:'thai',
          currency:'THB'
        },
        // {
        //   name: 'beijing',
        //   selected: false,
        //   lang:'chinese',
        //   currency:'CNY'
        // },
        // {
        //   name: 'shanghai',
        //   selected: false,
        //   lang:'chinese',
        // currency:'CNY'
        // },
        // {
        //   name: 'hong kong',
        //   selected: false,
        //   lang:'chinese',
        // currency:'CNY'
        // },
        // {
        //   name:'moscow',
        //   selected:false,
        //   lang:'russian',
        // currency:'RUB'

        // },
        // {
        //   name:'st petersburg',
        //   selected:false,
        //   lang:'russian',
                // currency:'RUB'

        // },
        // {
        //   name:'mumbai',
        //   selected:false,
        //   lang:'english',
                // currency:'INR'
        // },
        // {
        //   name:'bologna',
        //   selected:false,
        //   lang:'italian',
                // currency:'EUR'

        // },
        // {
        //   name:'rome',
        //   selected:false,
        //   lang:'italian',
                // currency:'EUR'

        // },
        // {
        //   name:'firenze',
        //   selected:false,
        //   lang:'italian'
                // currency:'EUR'

        // },
        // {
        //   name:'bangladesh',
        //   selected:false,
        //   lang:'english',
                // currency:'BDT'

        // }
      ]
    }
  ];

  public currentLangTextTemplate:string = '';
  public currentSelectedLang:string = CommonConstants.defaultLang;


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


   

    this.setPostTemplateTextArea(this.posts[0],CommonConstants.defaultLang);
  }

  private setPostTemplateTextArea(post:Post,lang:string){
    return this.postsService.getPostTemplateText(lang ,post)
    .then((text)=> {
      this.currentLangTextTemplate = text.text
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


  async handleQueueItem(post:Post,channel: Channel) {
    // this.postsQueue.push({
    //   channel:channel,
    //   post:post
    // });

    let postInSequentialOrder = await this.configService.getConfigValue<boolean>('post_in_sequential_order') ?? true;
    
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
          try{
            if(postInSequentialOrder === true){
              await this.postsService.submitPostToCraigslist(post, city);
              await this.handlePostSubmitted(channel.name);
            }else{
              this.postsService.submitPostToCraigslist(post,city).then(()=> this.handlePostSubmitted(channel.name))
            }
          }catch(e){
            alert('error as occurred')
          }

        }
        break;

    }
  }

  private async handlePostSubmitted(channelName){
      let thisPostIndex = this.postsQueue.findIndex((c) => c.channel.name == channelName);
      this.postsQueue = this.postsQueue.filter((p,i) => i != thisPostIndex);
      
      this.loadingProgress++;

      let selectedChannels = this.postsQueue;

      // let selectedChannels = this.getSelectedChannels();
      if (selectedChannels.length == 0) {
        return this.postingCompleted();
      } else {
        await this.handleQueueItem(this.postsQueue[0].post,this.postsQueue[0].channel);
      }

      this.cd.detectChanges();
  }

   // this.postsService.postToCraigslist(null,null).subscribe((result) => {
    //   // this.setChannelSelected('Craigslist', false);
    //   let thisPostIndex = this.postsQueue.findIndex((c) => c.channel.name == 'Craigslist');
    //   this.postsQueue = this.postsQueue.filter((p,i) => i != thisPostIndex);
      
    //   this.loadingProgress++;

    //   let selectedChannels = this.postsQueue;

    //   // let selectedChannels = this.getSelectedChannels();
    //   if (selectedChannels.length == 0) {
    //     return this.postingCompleted();
    //   } else {
    //     this.handleQueueItem(this.postsQueue[0].post,this.postsQueue[0].channel);
    //   }

    //   this.cd.detectChanges();
    // });


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

  async onTextLangChange(event){
    let selectedLanguage = event.target.value;
    let previousSelectedLang = this.currentSelectedLang;
    this.currentSelectedLang = selectedLanguage;

    //set previous Language text to what the user selected
    for(let post of this.posts){
      let postTextToUpdateIndex = post.postText.findIndex((i) => i.language == previousSelectedLang);
      if(postTextToUpdateIndex >= 0){
        post.postText[postTextToUpdateIndex].text = this.currentLangTextTemplate;
        break;
      }
    }

    //set textarea with the current selected Language text content 
    await this.setPostTemplateTextArea(this.post,selectedLanguage);
     
    // let currentLanguage  = 
  }

  async onPostClick() {
    // this.numberSelectedChannels = selectedChannels.length;
    // this.numberSelectedChannels = 0;
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
    
    let postsTotalCities = 0;
    for(let channel of this.channels){
      if(typeof channel.cities === 'undefined'){
        continue;
      }
      let selectedCities = channel.cities.filter(s => s.selected);
      postsTotalCities += selectedCities.length - 1 ;
    }

    this.numberSelectedChannels  = (this.posts.length * selectedChannels.length) +  (postsTotalCities );

    this.postsQueue = [];

    //create queue
    for(let post of this.posts){
      for(let selectedChannel of selectedChannels){
        this.postsQueue.push({post:post,channel:selectedChannel});
      }
    }

    for(let postQueue of this.postsQueue){
        await this.handleQueueItem(postQueue.post,postQueue.channel);
      
    }
    // this.channelPostingQueue;
  }
}


export interface Channel { 
  name: string, 
  selected: boolean, 
  cities?: Array<ChannelCity> 
};

export interface ChannelCity{
  name: string, selected: boolean, lang:string , currency:string
}
