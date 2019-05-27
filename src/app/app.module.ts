import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import { HighscoresComponent } from './highscores/highscores.component';
import { FriendlistComponent } from './friendlist/friendlist.component';
import { CardHandComponent } from './card-hand/card-hand.component';
import { GameComponent } from './game/game.component';
import { CardTableComponent } from './card-table/card-table.component';
import { ChatboxComponent } from './friendlist/chatbox/chatbox.component';

@NgModule({
    imports: [
        BrowserModule,

    ],
    declarations: [
        AppComponent,
        
        HighscoresComponent,
       
        FriendlistComponent,
        CardHandComponent,
        GameComponent,
        CardTableComponent,
        ChatboxComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
