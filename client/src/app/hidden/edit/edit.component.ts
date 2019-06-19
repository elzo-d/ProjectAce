import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  currentUser: string = this.authService.getUser();
  // email: string = this.authService.getEmail();
  changePassword = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  newPassword() {
    this.changePassword = !this.changePassword;
  }

}
