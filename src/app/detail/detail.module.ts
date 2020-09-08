import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import { SharedModule } from '../shared/shared.module';
import { PostDialogComponent } from './dialogs/post/post.dialog.component';

@NgModule({
  declarations: [
    DetailComponent, 
    PostDialogComponent,
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    DetailRoutingModule
  ]
})
export class DetailModule {}
