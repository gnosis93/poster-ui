import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private $getConfigSubject: Subject<any>;
  private $saveConfigSubject: Subject<boolean>;
  private $validateConfigSubject: Subject<string>;
  private $restoreConfigSubject:Subject<boolean>;

  constructor(
    private electron: ElectronService,
  ) {
    this.$getConfigSubject = new Subject<any>();
    this.$saveConfigSubject = new Subject<boolean>();
    this.$restoreConfigSubject = new Subject<boolean>();
    this.$validateConfigSubject = new Subject<string>();

    this.electron.ipcRenderer.addListener('getConfig', (e, args) => {
      this.$getConfigSubject.next(args);
    });

    this.electron.ipcRenderer.addListener('saveConfig', (e, args) => {
      this.$saveConfigSubject.next(args);
    });

    this.electron.ipcRenderer.addListener('validateConfig', (sender, message) => {
      this.$validateConfigSubject.next(message);
    })

    this.electron.ipcRenderer.addListener('restoreConfigToDefault', (sender, message) => {
      this.$restoreConfigSubject.next(message);
    })
  }

  public openBrowser(link:string){
    this.electron.ipcRenderer.send('openBrowser',link);
  }

  public getConfig(getConfig:boolean=true) {
    if(getConfig === true){
      this.electron.ipcRenderer.send('getConfig');
    }
    return this.$getConfigSubject.asObservable();
  }

  public async getConfigValue<T>(configValueKey: string) {
    let channelName = 'getConfigValue';
    return new Promise<T>((resolutionFunc, rejectionFunc) => {
      var handler = (sender, message) => {
        this.electron.ipcRenderer.removeListener(channelName,handler);
        resolutionFunc(message);
      };
      this.electron.ipcRenderer.addListener(channelName, handler);
      this.electron.ipcRenderer.send(channelName,configValueKey);
    });

  }

  public async fileExists(filePath: string) {
    let channelName = 'fileExists';
    return new Promise<boolean>((resolutionFunc, rejectionFunc) => {
      var handler = (sender, message) => {
        this.electron.ipcRenderer.removeListener(channelName,handler);
        resolutionFunc(message);
      };
      this.electron.ipcRenderer.addListener(channelName, handler);
      this.electron.ipcRenderer.send(channelName,filePath);

    });

  }

  public restoreConfig(sendRestoreConfig:boolean=true){
    if(sendRestoreConfig === true){
      this.electron.ipcRenderer.send('restoreConfigToDefault');
    }
    return this.$restoreConfigSubject.asObservable();
  }


  public saveConfig(config: any) {
    let configStr = JSON.stringify(config);

    this.electron.ipcRenderer.send('saveConfig', configStr)
    return this.$saveConfigSubject.asObservable();
  }

  async validateFacebookCredentials(){
    let facebookEmail    = await this.getConfigValue<string>('facebook_email');
    let facebookPassword = await this.getConfigValue<string>('facebook_password');

    if(!facebookEmail || facebookEmail.indexOf('@') == -1){
      return false;
    }

    if(!facebookPassword || facebookEmail.length <= 1){
      return false;
    }

    return true;
  }

  async validateCraigslistCredentials(){
    let craigslistEmail    = await this.getConfigValue<string>('craigslist_email');
    let craigslistPassword = await this.getConfigValue<string>('craigslist_password');

    if(!craigslistEmail || craigslistEmail.indexOf('@') == -1){
      return false;
    }

    if(!craigslistPassword || craigslistPassword.length <= 1){
      return false;
    }

    return true;
  }

  async validateLivinginsiderCredentials(){
    let livinginsiderEmail    = await this.getConfigValue<string>('livinginsider_email');
    let livinginsiderPassword = await this.getConfigValue<string>('livinginsider_password');

    if(!livinginsiderEmail || livinginsiderEmail.indexOf('@') == -1){
      return false;
    }

    if(!livinginsiderPassword || livinginsiderPassword.length <= 1){
      return false;
    }

    return true;
  }


  async validatBathsoldCredentials(){
    let bathsoldEmail    = await this.getConfigValue<string>('bathsold_email');
    let bathsoldPassword = await this.getConfigValue<string>('bathsold_password');

    if(!bathsoldEmail || bathsoldEmail.indexOf('@') == -1){
      return false;
    }

    if(!bathsoldPassword || bathsoldPassword.length <= 1){
      return false;
    }

    return true;
  }

  async validateFarangmartCredentials(){
    let bathsoldEmail    = await this.getConfigValue<string>('farangmart_email');
    let bathsoldPassword = await this.getConfigValue<string>('farangmart_password');

    if(!bathsoldEmail || bathsoldEmail.indexOf('@') == -1){
      return false;
    }

    if(!bathsoldPassword || bathsoldPassword.length <= 1){
      return false;
    }

    return true;
  }

  async validateListproperty4freeCredentials(){
    let bathsoldEmail    = await this.getConfigValue<string>('listproperty4free_username');
    let bathsoldPassword = await this.getConfigValue<string>('listproperty4free_password');

    // if(!bathsoldEmail || bathsoldEmail.indexOf('@') == -1){
    //   return false;
    // }

    if(!bathsoldPassword || bathsoldPassword.length <= 1){
      return false;
    }

    return true;
  }

  async validateConfigExecutablePath(){
    console.log('start validation check for chrome_executable_path')
    let excPathInConfig = await this.getConfigValue<string>('chrome_executable_path')
    console.log('excPathInConfig',excPathInConfig);
    if(excPathInConfig == null || String(excPathInConfig).length == 0){
      return false;
    }

    let executablePathExists = await this.fileExists(excPathInConfig);
    if(executablePathExists === false){
      return false;
    }

    return true;
  }



}
