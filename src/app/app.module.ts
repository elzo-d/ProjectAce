import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import { routing } from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { HighscoresComponent } from './highscores/highscores.component';
import { UserComponent } from './user/user.component';
import { FriendlistComponent } from './friendlist/friendlist.component';
import { CardHandComponent } from './card-hand/card-hand.component';
import { GameComponent } from './game/game.component';
import { CardTableComponent } from './card-table/card-table.component';
import { ChatboxComponent } from './friendlist/chatbox/chatbox.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        OrderModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        HighscoresComponent,
        UserComponent,
        FriendlistComponent,
        CardHandComponent,
        GameComponent,
        CardTableComponent,
        ChatboxComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
