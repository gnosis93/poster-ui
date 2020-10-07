import { BaseHelper } from "./helper.base";
import * as path from 'path';

export enum LogChannel { 'scheduler', 'general' };
export enum LogSeverity { 'warn', 'err', 'info' }

export interface LogEntry { logSeverity: LogSeverity | string, message: string, additionalData: any | Array<any> | null, date: string }

export class LoggerHelper extends BaseHelper {

    public static warn(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
        this.writeLog(message,additionalData,logChannel,LogSeverity.warn);
    }

    public static err(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
        this.writeLog(message,additionalData,logChannel,LogSeverity.err);
    }

    public static info(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general){
        this.writeLog(message,additionalData,logChannel,LogSeverity.info);
    }

    private static prettifyAdditionalLogData(additionalData: any | Array<any> ): any | Array<any>{
        if(typeof additionalData['name'] != 'undefined' && typeof additionalData['postText'] != 'undefined' ){
            return {'PostName':additionalData.name};
        }
        return additionalData;
    }


    public static writeLog(message: string, additionalData: any | Array<any> | null = null, logChannel: LogChannel = LogChannel.general, logSeverity: LogSeverity = LogSeverity.info) {
        let allLogs = this.getAllLogs(logChannel);
        let newLog = {
            logSeverity: LogSeverity[logSeverity],
            message: message,
            additionalData: this.prettifyAdditionalLogData(additionalData),
            date: new Date().toISOString()
        };
        console.log('logger event',newLog);
        allLogs.push(newLog);
        let logChannelPath = LoggerHelper.getLogChannelPath(logChannel);
        let fs   = require('fs');

        return fs.writeFileSync(logChannelPath ,JSON.stringify(allLogs));
    }

    public static getAllLogs(logChannel: LogChannel): LogEntry[] {
        let fs   = require('fs');
        let logFilePath = this.getLogChannelPath(logChannel);
        
        //create log file if it doesn't exist
        if (fs.existsSync(logFilePath) === false) {
            this.createEmptyLogFile(logFilePath);
        }

        let fileContents =  fs.readFileSync(logFilePath).toString();
        if(!fileContents || fileContents.length == 0){
            fileContents = JSON.stringify(this.createEmptyLogFile(logFilePath));
        }

        // let rawData =
        return JSON.parse(fileContents);
    }

    private static createEmptyLogFile(logFilePath:string){
        let logData = [];
        let fs   = require('fs');

        fs.writeFileSync(logFilePath, JSON.stringify(logData));
        return logData;
    }

    private static getLogChannelPath(logChannel: LogChannel) {
        let postsDir = this.getPostsDir();
        let logFileName = LogChannel[logChannel] + '.log.json';
        let logPath = path.join(postsDir, logFileName);
        return logPath;
    }

    
}