import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { MatDialogRef } from '@angular/material/dialog';
import { ipcMain } from 'electron';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent implements OnInit {

  public config:any;

  constructor(
    private electron: ElectronService,
    private zone:NgZone,
    private dialogRef:MatDialogRef<ConfigDialogComponent>
  ) { }

  ngOnInit(): void {
    this.electron.ipcRenderer.send('getConfig');
    this.electron.ipcRenderer.addListener('getConfig',(e,args)=>{
      this.config = args;
      console.log(this.config);
    });
  }

  public addFaceBookPage(urlToAddElement){
    this.config.facebook_pages.push(urlToAddElement.value);
    urlToAddElement.value = ""

  }

  public addFaceBookGroup(urlToAddElement){
    this.config.facebook_groups.push(urlToAddElement.value);
    urlToAddElement.value = "";
  }

  close(){
    this.dialogRef.close();
  }

  save(){
    let configStr = JSON.stringify(this.config)
    this.electron.ipcRenderer.send('saveConfig',configStr)
    console.log(configStr);
    this.dialogRef.close();
  
  }
}
