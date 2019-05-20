import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CardHandComponent } from './card-hand/card-hand.component';
import { GameComponent } from './game/game.component';
import { CardTableComponent } from './card-table/card-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CardHandComponent,
    GameComponent,
    CardTableComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
