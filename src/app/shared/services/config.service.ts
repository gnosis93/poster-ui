import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private $getConfigSubject:Subject<any>;
  private $saveConfigSubject:Subject<boolean>;

  constructor(
    private electron: ElectronService,
  ) {
    this.$getConfigSubject = new Subject<any>();
    this.$saveConfigSubject = new Subject<boolean>();

    this.electron.ipcRenderer.addListener('getConfig',(e,args)=>{
      this.$getConfigSubject.next(args);
    });

    this.electron.ipcRenderer.addListener('saveConfig',(e,args)=>{
      this.$saveConfigSubject.next(args);
    });


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

}
