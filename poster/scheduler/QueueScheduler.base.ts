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

  private static readonly LOG_MESSAGE = 'Scheduler posted successfully'
  private static readonly LOG_MESSAGE_FAIL = 'Scheduler posted failed'
  private static postExpiryTime = null;

  private static allLogs:LogEntry[] = [];

  private async buildQueue() {
    let postsFetch = (await PostsHelper.getListOfPosts());
    // let post
    for (let postDir of postsFetch.postsDirs) {
      let post = PostsHelper.getPostByName(postDir);
      if(QueueScheduler.postExistsInLogs(post) === false){
        this.queuedPosts.push(post);
      }
    }
    this.queuedPosts = this.shuffle(this.queuedPosts);
  }

  public static postExistsInLogs(post:Post):boolean{
    if(QueueScheduler.allLogs.length == 0){
      QueueScheduler.allLogs = LoggerHelper.getAllLogs(LogChannel.scheduler);
    }

    if(this.postExpiryTime === null){
      this.postExpiryTime = ConfigHelper.getConfigValue<number>('post_expiry_time',30);
    }

    for(let log of QueueScheduler.allLogs){
      if(log?.logSeverity == LogSeverity.info && log?.message === QueueScheduler.LOG_MESSAGE && log?.additionalData?.name == post.name){
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

  private async handleQueueItem(post: Post, city: ChannelCity) {
    if(typeof post == 'undefined' || !post){
      LoggerHelper.err('Invalid post given to handleQueueItem()',null,LogChannel.scheduler);
    }
    let config = ConfigHelper.getConfig();
    var result = false;
    try {
      // let price = await PostsHelper.handlePostPrice(post,city.currency);
      let poster = new CraigslistPoster(
        {
          username: config.craigslist_email,
          password: config.craigslist_password
        },
        post.images,
        ConfigHelper.parseTextTemplate(post, city.lang),
        post?.metaData?.title,
        'Pattaya',
        post.metaData?.price,
        post?.metaData?.size,
        ConfigHelper.getConfigValue('phone_number'),
        ConfigHelper.getConfigValue('phone_extension'),
        city.name,
        ConfigHelper.getConfigValue('post_immediately', false)
      );
      
      result = await poster.run();

      LoggerHelper.info(QueueScheduler.LOG_MESSAGE,post,LogChannel.scheduler);
    
    } catch (e) {
      result = false;
      console.error(e);
      LoggerHelper.err(QueueScheduler.LOG_MESSAGE_FAIL+' exception: '+e.toString() ,post,LogChannel.scheduler);
    }

    return result;
  }

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

  public abstract registerScheduler():void;

  // public static abstract registerSchedule(){
  //   var queueScheduler      = new QueueScheduler();
  //   var schedulerCRONConfig = ConfigHelper.getConfigValue<boolean>('criagslist_scheduler_cron', false);

  //   schedule.scheduleJob(schedulerCRONConfig, () => {
  //       queueScheduler.handleQueue();
  //   });
  // }

}