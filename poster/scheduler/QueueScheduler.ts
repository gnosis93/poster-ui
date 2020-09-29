import { Post, ChannelCity } from "../models/post.interface";
import { ConfigHelper } from "../helpers/config.helper";
import { CraigslistPoster } from "../channels/craigslist/craigslist.group.poster";
import { PostsHelper } from "../helpers/posts.helper";
import {LoggerHelper, LogChannel, LogEntry, LogSeverity} from '../helpers/logger.helper'
export class QueueScheduler {
  public queuedPosts: Array<Post> = [];
  private readonly defaultPost = {
    name: 'bangkok',
    selected: true,
    lang: 'thai',
    currency: 'THB'
  };

  private static readonly LOG_MESSAGE = 'Scheduler posted successfully'
  private static readonly LOG_MESSAGE_FAIL = 'Scheduler posted failed'
  private static readonly POST_EXPIRY = 60 * 60 * 24 * 2;

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
    // this.queuedPosts = this.shuffle(this.queuedPosts);
  }

  public static postExistsInLogs(post:Post):boolean{
    if(QueueScheduler.allLogs.length == 0){
      QueueScheduler.allLogs = LoggerHelper.getAllLogs(LogChannel.scheduler);
    }

    for(let log of QueueScheduler.allLogs){
      if(log?.logSeverity == LogSeverity.info && log?.message === QueueScheduler.LOG_MESSAGE && log?.additionalData?.name == post.name){
        return true;
      }
    }
    return false;
  }

  public async handleQueue() {
    if (this.queuedPosts.length === 0) {
     await this.buildQueue();
    }
    let currentPost = this.queuedPosts.pop();
    this.handleQueueItem(currentPost, this.defaultPost);
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
      LoggerHelper.err(QueueScheduler.LOG_MESSAGE_FAIL+' exepction: '+e.toString() ,post,LogChannel.scheduler);
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

}