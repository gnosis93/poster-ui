import { QueueScheduler } from "./QueueScheduler.base";
import * as schedule from 'node-schedule';
import { ConfigHelper } from "../helpers/config.helper";
import { ChannelCity, Post } from "../models/post.interface";
import { LivinginsiderPoster } from "../channels/livinginsider/livinginsider.group.poster";
import { LogChannel, LoggerHelper } from "../helpers/logger.helper";
import { ScreenshootHelper } from "../helpers/screenshot.helper";

export class LivinginsiderQueueScheduler extends QueueScheduler{
    protected ENABLE_SCHEDULER_KEY: string = 'livinginsider_enable_scheduler';
    protected POST_EXPIRY_TIME_CONFIG_KEY: string = 'livinginsider_post_expiry_time';
    protected static singleton = null;
    protected readonly cronValueConfigKey = 'livinginsider_scheduler_cron'

    readonly LOG_MESSAGE = 'Livinginsider Scheduler posted successfully'
    readonly LOG_MESSAGE_FAIL = 'Livinginsider Scheduler posted failed'
    


    public static getInstance():LivinginsiderQueueScheduler{
        if(LivinginsiderQueueScheduler.singleton == null){
            LivinginsiderQueueScheduler.singleton = new LivinginsiderQueueScheduler();
        }
        return LivinginsiderQueueScheduler.singleton
    }
    
    protected async handleQueueItem(post: Post, city: ChannelCity) {
        if(typeof post == 'undefined' || !post){
          LoggerHelper.err('Invalid post given to handleQueueItem()',null,LogChannel.scheduler);
        }
        let config = ConfigHelper.getConfig();
        var result = false;
        var poster:LivinginsiderPoster|null = null;
        try {
          // let price = await PostsHelper.handlePostPrice(post,city.currency);
          poster = new LivinginsiderPoster(
            {
              username: config.livinginsider_email,
              password: config.livinginsider_password 
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
            ConfigHelper.getConfigValue('post_immediately', false),
            Number(post.metaData.beds),
            Number(post.metaData.baths)
          );
          
          result = await poster.run();
    
          LoggerHelper.info(this.LOG_MESSAGE,post,LogChannel.scheduler);
          await ScreenshootHelper.takeSuccessScreenShot('livinginsider_'+post.name,poster.Browser);

        } catch (e) {
          result = false;
          console.error(e);
          await ScreenshootHelper.takeErrorScreenShot('livinginsider_'+post.name,poster.Browser);
          await poster.kill();
          LoggerHelper.err(this.LOG_MESSAGE_FAIL+' exception: '+e.toString() ,post,LogChannel.scheduler);
          this
        }
    
        return result;
      }
}