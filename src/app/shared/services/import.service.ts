import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  private $importHotDogCondosSubject:Subject<boolean>;
  private $validateConfigSubject:Subject<string>;

  constructor(
    private electron: ElectronService,
  ) { 
    this.$importHotDogCondosSubject = new Subject<boolean>();
    this.$validateConfigSubject     = new Subject<string>();

    this.electron.ipcRenderer.addListener('websiteImport',(sender,message)=>{
      this.$importHotDogCondosSubject.next(message);
    })

    this.electron.ipcRenderer.addListener('validateConfig',(sender,message)=>{
      this.$validateConfigSubject.next(message);
    })
  }


  public importHotdogCondos(startImport:boolean=true){
    if(startImport === true){
      this.electron.ipcRenderer.send('websiteImport');
    }
    return this.$importHotDogCondosSubject.asObservable();
  }

  public validateConfigFile(posting: boolean){
    this.electron.ipcRenderer.send('validateConfig', posting);
    return this.$validateConfigSubject.asObservable();
  }
}
