import { QueueScheduler } from "./QueueScheduler.base";
import * as schedule from 'node-schedule';
import { ConfigHelper } from "../helpers/config.helper";
import { ChannelCity, Post } from "../models/post.interface";
import { CraigslistPoster } from "../channels/craigslist/craigslist.group.poster";
import { LogChannel, LoggerHelper } from "../helpers/logger.helper";

export class CraigslistQueueScheduler extends QueueScheduler{
    protected static singleton = null;
    protected readonly cronValueConfigKey = 'criagslist_scheduler_cron';
    protected POST_EXPIRY_TIME_CONFIG_KEY: string = 'criagslist_post_expiry_time';
    protected ENABLE_SCHEDULER_KEY: string = 'criagslist_enable_scheduler';

    readonly LOG_MESSAGE = 'Craigslist Scheduler posted successfully';
    readonly LOG_MESSAGE_FAIL = 'Craigslist Scheduler posted failed';

    public static getInstance():CraigslistQueueScheduler{
        if(CraigslistQueueScheduler.singleton == null){
            CraigslistQueueScheduler.singleton = new CraigslistQueueScheduler();
        }
        return CraigslistQueueScheduler.singleton
    }
    
    protected async handleQueueItem(post: Post, city: ChannelCity) {
        if(typeof post == 'undefined' || !post){
          LoggerHelper.err('Invalid post given to handleQueueItem()',null,LogChannel.scheduler);
        }
        let config = ConfigHelper.getConfig();
        var result = false;
        var poster:CraigslistPoster = null;
        try {
          // let price = await PostsHelper.handlePostPrice(post,city.currency);
          poster = new CraigslistPoster(
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
    
          LoggerHelper.info(this.LOG_MESSAGE,post,LogChannel.scheduler);
        
        } catch (e) {
          result = false;
          await poster.kill()
          console.error(e);
          LoggerHelper.err(this.LOG_MESSAGE_FAIL+' exception: '+e.toString() ,post,LogChannel.scheduler);
        }
    
        return result;
      }
}