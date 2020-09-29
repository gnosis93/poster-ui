import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ProgressSpinnerDialogComponent } from './components/progress-spinner-dialog/progress-spinner-dialog.component';
import { ConfigDialogComponent } from './components/config-dialog/config-dialog.component';
import {PostsService} from './services/posts.service';
import {ImportService} from './services/import.service';
import {ConfigService} from './services/config.service';
import {LogService} from './services/log.service';


@NgModule({
  providers:[
    PostsService,
    ConfigService,
    ImportService,
    LogService
  ],

  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ProgressSpinnerDialogComponent,
    ConfigDialogComponent,
  ],

  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],

  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    ProgressSpinnerDialogComponent,
    MaterialModule,
    BrowserAnimationsModule,
    ConfigDialogComponent
  ]

})
export class SharedModule {}
