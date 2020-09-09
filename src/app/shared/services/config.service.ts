import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private $getConfigSubject:Subject<any>;
  private $saveConfigSubject:Subject<boolean>;
  private $validateConfigSubject:Subject<string>;

  constructor(
    private electron: ElectronService,
  ) {
    this.$getConfigSubject      = new Subject<any>();
    this.$saveConfigSubject     = new Subject<boolean>();
    this.$validateConfigSubject = new Subject<string>();

    this.electron.ipcRenderer.addListener('getConfig',(e,args)=>{
      this.$getConfigSubject.next(args);
    });

    this.electron.ipcRenderer.addListener('saveConfig',(e,args)=>{
      this.$saveConfigSubject.next(args);
    });

    this.electron.ipcRenderer.addListener('validateConfig',(sender,message)=>{
      this.$validateConfigSubject.next(message);
    })
  }

  public getConfig(){
    this.electron.ipcRenderer.send('getConfig');
    return this.$getConfigSubject.asObservable();
  }


  public saveConfig(config:any){
    let configStr = JSON.stringify(config);

    this.electron.ipcRenderer.send('saveConfig',configStr)
    return this.$saveConfigSubject.asObservable();
  }

  public validateConfigData(posting: boolean){
    this.electron.ipcRenderer.send('validateConfig', posting);
    return this.$validateConfigSubject.asObservable();
  }
}
