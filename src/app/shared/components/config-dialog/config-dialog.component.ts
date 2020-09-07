import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { MatDialogRef } from '@angular/material/dialog';
import { ipcMain } from 'electron';
import { ConfigService } from 'app/shared/services/config.service';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent implements OnInit {

  public config:any;

  constructor(
    private configService:ConfigService,
    private dialogRef:MatDialogRef<ConfigDialogComponent>
  ) { }

  ngOnInit(): void {
   this.configService.getConfig().subscribe((config)=>this.config = config);
  }

  public addFaceBookPage(urlToAddElement){
    this.config.facebook_pages.push(urlToAddElement.value);
    urlToAddElement.value = ""
  }

  public addFaceBookGroup(urlToAddElement){
    this.config.facebook_groups.push(urlToAddElement.value);
    urlToAddElement.value = "";
  }

  headlessValueChange(value:{checked:boolean}){
    this.config.headless = value.checked;
    console.log(value);
  }

  close(){
    this.dialogRef.close();
  }

  save(){
    this.configService.saveConfig(this.config);//TODO: consider subscribe and add loader
    this.dialogRef.close();

  }
}
