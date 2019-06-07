import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService as guard} from './auth/auth-guard.service';
import {AuthService} from './auth/auth.service'
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'hidden', redirectTo: 'hidden/lobby', pathMatch: 'full'}, // Always point to a valid page
  {path: 'login', component: LoginComponent},
  {path: 'hidden', loadChildren: './hidden/hidden.module#HiddenModule', canActivate: [guard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [guard, AuthService],
  exports: [RouterModule]
})
export class AppRoutingModule {}