import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-hidden',
  templateUrl:'hidden.component.html',
})
export class HiddenComponent implements OnInit {

  constructor(private authservice:AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authservice.logout()
  }

}
