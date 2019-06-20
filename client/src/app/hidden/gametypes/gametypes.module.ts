import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PestenComponent} from './pesten/pesten.component';

@NgModule({
  declarations: [
    PestenComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PestenComponent
  ]
})
export class GametypesModule { }
