import { Post, ChannelCity } from "../models/post.interface";
import { ConfigHelper } from "../helpers/config.helper";
import { CraigslistPoster } from "../channels/craigslist/craigslist.group.poster";
import { PostsHelper } from "../helpers/posts.helper";
import {LoggerHelper, LogChannel, LogEntry, LogSeverity} from '../helpers/logger.helper';
import * as moment from 'moment';
import * as schedule from 'node-schedule';

export abstract class QueueScheduler {
  public queuedPosts: Array<Post> = [];
  private readonly defaultPost = {
    name: 'bangkok',
    selected: true,
    lang: 'thai',
    currency: 'THB'
  };

  protected abstract readonly LOG_MESSAGE:string;
  protected abstract readonly LOG_MESSAGE_FAIL:string;
  protected abstract readonly POST_EXPIRY_TIME_CONFIG_KEY:string;
  protected abstract readonly ENABLE_SCHEDULER_KEY:string;

  private  postExpiryTime:number = 30;//default
  protected abstract readonly cronValueConfigKey;

  private  allLogs:LogEntry[] = [];

  

  // private static getInstance(instance:T){
  //   this.singleton = new ();
  // }


  protected async buildQueue() {
    let postsFetch = (await PostsHelper.getListOfPosts());
    // let post
    for (let postDir of postsFetch.postsDirs) {
      let post = PostsHelper.getPostByName(postDir);
      if(this.postExistsInLogs(post) === false){
        this.queuedPosts.push(post);
      }
    }
    this.queuedPosts = this.shuffle(this.queuedPosts);
  }

  public  postExistsInLogs(post:Post):boolean{
    if(this.allLogs.length == 0){
      this.allLogs = LoggerHelper.getAllLogs(LogChannel.scheduler);
    }

    if(this.postExpiryTime === null){
      this.postExpiryTime = ConfigHelper.getConfigValue<number>(this.POST_EXPIRY_TIME_CONFIG_KEY,30);
    }

    for(let log of this.allLogs){
      if(log?.logSeverity == LogSeverity.info && log?.message === this.LOG_MESSAGE && log?.additionalData?.name == post.name){
        let logISRecent =  moment(log.date).add(this.postExpiryTime,'days').isAfter(moment());//log is recent if it hasn't expired (as per POST_EXPIRY_DAYS const)
        if(logISRecent){
          return true;
        }
      }
    }
    return false;
  }

  public async handleQueue() {
    if (this.queuedPosts.length === 0) {
     await this.buildQueue();
    }
    let postingsPerCronTrigger = ConfigHelper.getConfigValue<number>('criagslist_postings_per_trigger') ?? 1;
    for(let i=1;i<=postingsPerCronTrigger;i++){
      let currentPost = this.queuedPosts.pop();
      await this.handleQueueItem(currentPost, this.defaultPost);
    }
  }

  protected abstract async handleQueueItem(post: Post, city: ChannelCity);
  

  private shuffle(array: any[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex = currentIndex - 1;

      // And swap it with the current element.
      temporaryValue      = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex]  = temporaryValue;
    }

    return array;
  }

  public registerScheduler(): void {
    var schedulerEnabled = ConfigHelper.getConfigValue<boolean>(this.ENABLE_SCHEDULER_KEY, false);
    if(schedulerEnabled){
      var schedulerCRONConfig = ConfigHelper.getConfigValue<boolean>(this.cronValueConfigKey, false);
      schedule.scheduleJob(schedulerCRONConfig, () => {
          this.handleQueue();
      });
    }
   
}

  // public static abstract registerSchedule(){
  //   var queueScheduler      = new QueueScheduler();
  //   var schedulerCRONConfig = ConfigHelper.getConfigValue<boolean>('criagslist_scheduler_cron', false);

  //   schedule.scheduleJob(schedulerCRONConfig, () => {
  //       queueScheduler.handleQueue();
  //   });
  // }

}