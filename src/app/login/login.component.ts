/* 
 * Based on the tutorial from:
 * https://jasonwatmore.com/post/2018/05/16/angular-6-user-registration-and-login-example-tutorial
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup
  loading = false
  submitted = false

  // constructor(private formBuilder:FormBuilder) {}

  ngOnInit() {
    // this.loginForm = this.formBuilder.group({
    //     username: ['', Validators.required],
    //     password: ['', Validators.required]
    // })
  }

  onSubmit() {
  }

}
