import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service'

@Component({ 
    selector: 'app-root', 
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
 })
export class AppComponent {

  constructor(
    public guard: AuthService 
  ) {}

  logout() {
    console.log("hier")
    this.guard.logout()
  }
}