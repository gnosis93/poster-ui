import { QueueScheduler } from "./QueueScheduler.base";
import { Post, ChannelCity } from "../models/post.interface";
import { LoggerHelper, LogChannel } from "../helpers/logger.helper";
import { ConfigHelper } from "../helpers/config.helper";
import { CraigslistPoster } from "../channels/craigslist/craigslist.group.poster";
import { BathsoldPoster } from "../channels/bathsold/bathsold.poster";
import { ScreenshootHelper } from "../helpers/screenshot.helper";

export class BathSoldQueueScheduler extends QueueScheduler {
    protected readonly LOG_MESSAGE = 'BathSold Scheduler posted successfully';
    protected readonly LOG_MESSAGE_FAIL = 'BathSold Scheduler posted failed';
    protected static singleton = null;
    
    protected ENABLE_SCHEDULER_KEY: string = 'bathsold_enable_scheduler';
    protected readonly cronValueConfigKey = 'bathsold_scheduler_cron'
    protected POST_EXPIRY_TIME_CONFIG_KEY: string = 'bathsold_post_expiry_time';


    public static getInstance(): BathSoldQueueScheduler {
        if (BathSoldQueueScheduler.singleton == null) {
            BathSoldQueueScheduler.singleton = new BathSoldQueueScheduler();
        }
        return BathSoldQueueScheduler.singleton
    }


    protected async handleQueueItem(post: Post, city: ChannelCity) {
        if (typeof post == 'undefined' || !post) {
            LoggerHelper.err('Invalid post given to handleQueueItem()', null, LogChannel.scheduler);
        }
        let config = ConfigHelper.getConfig();
        var result = false;
        var poster:BathsoldPoster|null = null;
        try {
            // let price = await PostsHelper.handlePostPrice(post,city.currency);
            poster = new BathsoldPoster(
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
                ConfigHelper.getConfigValue('post_immediately', false),
                Number(post.metaData.beds),
                Number(post.metaData.baths),
            );

            result = await poster.run();
            LoggerHelper.info(this.LOG_MESSAGE, post, LogChannel.scheduler);

        } catch (e) {
            result = false;
            console.error(e);
            await ScreenshootHelper.takeErrorScreenShot('bathsold_'+post?.metaData?.title,poster.Browser,e.toString());

            LoggerHelper.err(this.LOG_MESSAGE_FAIL + ' exception: ' + e.toString(), post, LogChannel.scheduler);

            await poster.kill();
        }

        return result;
    }
}