import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component'
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common';

const loginRoutes: Routes = [
  {path: '', component: LoginComponent},
]

@NgModule({
  declarations: [
    LoginComponent,
  ],
  exports: [],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(loginRoutes),
  ]
})

export class LoginModule {}