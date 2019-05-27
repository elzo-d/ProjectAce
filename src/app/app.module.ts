import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'
import {LoginComponent} from './login/login.component';
import {GameComponent} from './game/game.component';
import {CardHandComponent} from './card-hand/card-hand.component';
import {CardTableComponent} from './card-table/card-table.component';
import {PcardComponent} from './pcard/pcard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    CardHandComponent,
    CardTableComponent,
    PcardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
