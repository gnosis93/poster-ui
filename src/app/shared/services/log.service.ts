import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { CommonConstants } from '../common-const';
import { ElectronService } from '../../core/services';
import {ChannelCity} from '../../detail/dialogs/post/post.dialog.component'
import { LogSeverity, LogChannel, LogEntry } from '../../../../poster/helpers/logger.helper';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private electron: ElectronService,
    private configService:ConfigService
  ) {
  }

  public async warn(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
    console.warn({
        message:message,additionalData:additionalData,logChannel:logChannel
    });  
    return this.log(message,additionalData,logChannel,LogSeverity.err);
  }

  public async err(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
    console.error({
        message:message,additionalData:additionalData,logChannel:logChannel
    });  
    return this.log(message,additionalData,logChannel,LogSeverity.err);
  }

  public async info(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
    console.info({
        message:message,additionalData:additionalData,logChannel:logChannel
    });  
    return this.log(message,additionalData,logChannel,LogSeverity.info);
  }

  public async log(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general, logSeverity: LogSeverity = LogSeverity.info) {
    let channelName = 'log';
    return new Promise((resolutionFunc, rejectionFunc) => {
   
      var handler = (sender, message) => {
        this.electron.ipcRenderer.removeListener(channelName,handler);
        resolutionFunc(message);
      };

      this.electron.ipcRenderer.addListener(channelName, handler);
   
      let logEntry:LogEntry = {
        logSeverity:logSeverity,
        message:message,
        additionalData:additionalData,
        date:null
      };

      this.electron.ipcRenderer.send(channelName,logEntry,logChannel);
    });

  }

}