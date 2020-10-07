import { QueueScheduler } from "./QueueScheduler.base";
import * as schedule from 'node-schedule';
import { ConfigHelper } from "../helpers/config.helper";
import { ChannelCity, Post } from "../models/post.interface";
import { LogChannel, LoggerHelper } from "../helpers/logger.helper";
import { FacebookPagePoster } from "../channels/facebook/facebook.page.poster";
import { FacebookOldPagePoster } from "../channels/facebook/facebook-old.page.poster";
import { ScreenshootHelper } from "../helpers/screenshot.helper";

export class FacebookPageQueueScheduler extends QueueScheduler{
    protected ENABLE_SCHEDULER_KEY: string = 'facebookpages_enable_scheduler';
    protected POST_EXPIRY_TIME_CONFIG_KEY: string = 'facebookpages_post_expiry_time';
    protected static singleton = null;
    protected readonly cronValueConfigKey = 'facebookpages_scheduler_cron'

    readonly LOG_MESSAGE = 'FacebookPages Scheduler posted successfully'
    readonly LOG_MESSAGE_FAIL = 'FacebookPages Scheduler posted failed'
    
    public static getInstance():FacebookPageQueueScheduler{
        if(FacebookPageQueueScheduler.singleton == null){
          FacebookPageQueueScheduler.singleton = new FacebookPageQueueScheduler();
        }
        return FacebookPageQueueScheduler.singleton
    }
    
    protected async handleQueueItem(post: Post, city: ChannelCity) {
        if(typeof post == 'undefined' || !post){
          LoggerHelper.err('Invalid post given to handleQueueItem()',null,LogChannel.scheduler);
        }
        let config = ConfigHelper.getConfig();
        var result = false;
        var poster:FacebookPagePoster|FacebookOldPagePoster|null = null;
        try {
          // let price = await PostsHelper.handlePostPrice(post,city.currency);
          if(config.facebook_old_style === true){
            poster = new FacebookPagePoster(
              config.facebook_pages,
              {
                username: config.facebook_email,
                password: config.facebook_password 
              },
              post.images,
              ConfigHelper.parseTextTemplate(post, city.lang),
            );
            
            result = await poster.run();
          }else{
            poster = new FacebookOldPagePoster(
              config.facebook_pages,
              {
                username: config.facebook_email,
                password: config.facebook_password 
              },
              post.images,
              ConfigHelper.parseTextTemplate(post, city.lang),
            );
            
            result = await poster.run();
          }

          LoggerHelper.info(this.LOG_MESSAGE,post,LogChannel.scheduler);
        
        } catch (e) {
          result = false;
          console.error(e);
          await ScreenshootHelper.takeErrorScreenShot('facebookPages_'+post.name,poster.Browser);
          await poster.kill();
          LoggerHelper.err(this.LOG_MESSAGE_FAIL+' exception: '+e.toString() ,post,LogChannel.scheduler);
        }
    
        return result;
      }
}