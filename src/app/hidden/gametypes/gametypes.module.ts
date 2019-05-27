import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PestenComponent} from './pesten/pesten.component';
import {CardHandComponent} from './card-hand/card-hand.component';
import {CardTableComponent} from './card-table/card-table.component';
import {PcardComponent} from './pcard/pcard.component';

@NgModule({
  declarations: [
    PestenComponent,
    CardHandComponent,
    CardTableComponent,
    PcardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PestenComponent
  ]
})
export class GametypesModule { }
