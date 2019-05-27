import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import {LoginComponent} from './login/login.component';
import {GameComponent} from './game/game.component';
import {CardHandComponent} from './card-hand/card-hand.component';
import {CardTableComponent} from './card-table/card-table.component';
import {HighscoresComponent} from './highscores/highscores.component';
import {FriendlistComponent} from './friendlist/friendlist.component';
import {OrderModule} from 'ngx-order-pipe';
import {ChatboxComponent} from './friendlist/chatbox/chatbox.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    CardHandComponent,
    CardTableComponent,
    HighscoresComponent,
    FriendlistComponent,
    ChatboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OrderModule
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }