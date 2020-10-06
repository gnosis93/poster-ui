import { QueueScheduler } from "./QueueScheduler.base";
import * as schedule from 'node-schedule';
import { ConfigHelper } from "../helpers/config.helper";

export class CraigslistQueueScheduler extends QueueScheduler{
    
    
    public registerScheduler(): void {
        var schedulerCRONConfig = ConfigHelper.getConfigValue<boolean>('criagslist_scheduler_cron', false);

        schedule.scheduleJob(schedulerCRONConfig, () => {
            this.handleQueue();
        });
    }
    
}