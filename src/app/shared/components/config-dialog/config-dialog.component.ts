import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { MatDialogRef } from '@angular/material/dialog';
import { ipcMain } from 'electron';
import { ConfigService } from 'app/shared/services/config.service';
import { CommonConstants } from 'app/shared/common-const';


type ConfigSection = "Facebook Credentials"      | 
                     "Craigslist Credentials"    | 
                     "Craigslist Channel"        |
                     "Facebook Pages Channel"    |
                     "Facebook Groups Channel"   |
                     "General Channels Settings" |
                     "Behavior"                  |
                     "Text Templates"            
;

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent implements OnInit {

  public config:any;

  public selectedTemplate:ConfigSection = 'Facebook Credentials'
  public languages = CommonConstants.languages;

  constructor(
    private configService:ConfigService,
    private dialogRef:MatDialogRef<ConfigDialogComponent>,
    private zone:NgZone
  ) { }

  ngOnInit(): void {
   
   this.configService.getConfig(false).subscribe((config)=>{
      this.zone.run(()=>{
        this.config = config
      });
    });
    
   this.configService.restoreConfig(false).subscribe((result)=>{
     if(!result){
      alert('an error as occurred while restoring defaults');
      return;
    }
    this.getConfig();
    // this.dialogRef.close();
   });

   this.getConfig();

  }

  private getConfig(){
    this.configService.getConfig();
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

  postImmediatelyValueChange(value:{checked:boolean}){
    this.config.post_immediately = value.checked;
    console.log(value);
  }

  facebookStyleValueChange(value:{checked:boolean}){
    this.config.facebook_old_style = value.checked;
    console.log(value);
  }
  
  onRestoreConfigToDefaults(){
    this.configService.restoreConfig();
  }

  onSidebarClick(selectedItem:ConfigSection){
    this.selectedTemplate = selectedItem;
  }

  onTextTemplateChange($event,lang){
    this.config[lang+'_text_template'] = $event.target.value;
    console.log($event);
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
