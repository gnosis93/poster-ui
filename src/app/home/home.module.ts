import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule, 
    SharedModule, 
    HomeRoutingModule,
    MaterialModule,
  ]
})
export class HomeModule {}
