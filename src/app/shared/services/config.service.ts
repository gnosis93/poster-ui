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

  constructor(
    private electron: ElectronService,
  ) {
    this.$getConfigSubject = new Subject<any>();
    this.$saveConfigSubject = new Subject<boolean>();
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
  }

  public getConfig() {
    this.electron.ipcRenderer.send('getConfig');
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

  public saveConfig(config: any) {
    let configStr = JSON.stringify(config);

    this.electron.ipcRenderer.send('saveConfig', configStr)
    return this.$saveConfigSubject.asObservable();
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
