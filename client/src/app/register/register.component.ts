import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, RequiredValidator } from "@angular/forms";
import { first } from "rxjs/operators";
import { PasswordValidation } from './../hidden/edit/password-validation';

import { UserService } from "../user.service";
import { AuthService } from "../auth/auth.service";
import { AlertService } from "../alert.service";

@Component({
  selector: "register",
  templateUrl: "register.component.html",
  providers: [AlertService],
  styleUrls: ["./../app.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      username: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(16)]
      ],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required]
    },{
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService
      .register(
        this.registerForm.value.username,
        this.registerForm.value.newPassword,
        this.registerForm.value.email
      )
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
