/*
https://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial
Author: Jason Watmore
*/

import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { HighscoresComponent } from './highscores/highscores.component';
import { UserComponent } from './user/user.component';
import { FriendlistComponent } from './friendlist/friendlist.component';
import { GameComponent } from './game/game.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'highscores', component: HighscoresComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'friendlist', component: FriendlistComponent },
    {path: "game", component: GameComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
