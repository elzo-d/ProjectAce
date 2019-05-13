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

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'highscores', component: HighscoresComponent },
    { path: 'user/:username', component: UserComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);