import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-secret',
  templateUrl:'secret.component.html',
})
export class SecretComponent implements OnInit {

  constructor(private authservice:AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authservice.logout()
  }

}
