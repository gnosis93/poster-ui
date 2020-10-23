import { QueueScheduler } from "./QueueScheduler.base";
import { Post, ChannelCity } from "../models/post.interface";
import { LoggerHelper, LogChannel } from "../helpers/logger.helper";
import { ConfigHelper } from "../helpers/config.helper";
import { ScreenshootHelper } from "../helpers/screenshot.helper";
import { Listproperty4freePoster } from "../channels/listproperty4free/listproperty4free.poster";

export class Listproperty4freeQueueScheduler extends QueueScheduler {
    protected readonly LOG_MESSAGE = 'Listproperty4free Scheduler posted successfully';
    protected readonly LOG_MESSAGE_FAIL = 'Listproperty4free Scheduler posted failed';
    protected static singleton = null;
    
    protected ENABLE_SCHEDULER_KEY: string = 'listproperty4free_enable_scheduler';
    protected readonly cronValueConfigKey = 'listproperty4free_scheduler_cron'
    protected POST_EXPIRY_TIME_CONFIG_KEY: string = 'listproperty4free_post_expiry_time';


    public static getInstance(): Listproperty4freeQueueScheduler {
        if (Listproperty4freeQueueScheduler.singleton == null) {
            Listproperty4freeQueueScheduler.singleton = new Listproperty4freeQueueScheduler();
        }
        return Listproperty4freeQueueScheduler.singleton
    }


    protected async handleQueueItem(post: Post, city: ChannelCity) {
        if (typeof post == 'undefined' || !post) {
            LoggerHelper.err('Invalid post given to handleQueueItem()', null, LogChannel.scheduler);
        }
        let config = ConfigHelper.getConfig();
        var result = false;
        var poster:Listproperty4freePoster|null = null;
        try {
            // let price = await PostsHelper.handlePostPrice(post,city.currency);
            poster = new Listproperty4freePoster(
                {
                    username: config.listproperty4free_email,
                    password: config.listproperty4free_password
                },
                post.images,
                ConfigHelper.parseTextTemplate(post, city.lang),
                post?.metaData?.title,
                'Pattaya',
                post.metaData?.price,
                post?.metaData?.rentalPrice,
                post?.metaData?.size,
                ConfigHelper.getConfigValue('phone_number'),
                ConfigHelper.getConfigValue('phone_extension'),
                ConfigHelper.getConfigValue('post_immediately', false),
                Number(post.metaData.beds),
                Number(post.metaData.baths),
            );

            result = await poster.run();
            LoggerHelper.info(this.LOG_MESSAGE, post, LogChannel.scheduler);

        } catch (e) {
            result = false;
            console.error(e);
            await ScreenshootHelper.takeErrorScreenShot('listproperty4free_'+post?.metaData?.title,poster.Browser,e.toString());

            LoggerHelper.err(this.LOG_MESSAGE_FAIL + ' exception: ' + e.toString(), post, LogChannel.scheduler);

            await poster.kill();
        }

        return result;
    }
}