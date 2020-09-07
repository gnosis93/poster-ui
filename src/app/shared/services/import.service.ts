import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  private $importHotDogCondosSubject:Subject<boolean>;

  constructor(
    private electron: ElectronService,
  ) { 
    this.$importHotDogCondosSubject = new Subject<boolean>();

    this.electron.ipcRenderer.addListener('websiteImport',(sender,message)=>{
      this.$importHotDogCondosSubject.next(message);
    })
  }


  public importHotdogCondos(startImport:boolean=true){
    if(startImport === true){
      this.electron.ipcRenderer.send('websiteImport');
    }
    return this.$importHotDogCondosSubject.asObservable();
  }
}
