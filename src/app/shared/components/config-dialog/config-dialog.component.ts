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
  
  onDeletePageClick(pageUrl:string){
    if(confirm('Are you sure you want to delete this page ?') === false){
      return;
    }

    if(!this.config){
      return;
    }
    
    let pages = this.config.facebook_pages;
    let pagesRedefined = [];
    for(let page of pages){
      if(pageUrl === page){
        continue;
      }
      pagesRedefined.push(page);
    }
    this.config.facebook_pages = pagesRedefined;
  }

  onDeleteGroupClick(groupUrl:string){
    if(confirm('Are you sure you want to delete this group ?') === false){
      return;
    }
    if(!this.config){
      return;
    }
    let groups = this.config.facebook_groups;
    let groupsRedefined = [];
    for(let group of groups){
      if(groupUrl === group){
        continue;
      }
      groupsRedefined.push(group);
    }
    this.config.facebook_groups = groupsRedefined;
  }

  close(){
    this.dialogRef.close();
  }

  save(){
    this.configService.saveConfig(this.config);//TODO: consider subscribe and add loader
    this.dialogRef.close();

  }
}
