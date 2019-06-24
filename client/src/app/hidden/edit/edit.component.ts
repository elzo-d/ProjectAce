import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user.service";
import { AuthService } from "../../auth/auth.service";
import { AlertService } from "../../alert.service";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { PasswordValidation } from './password-validation';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [AlertService]
})
export class EditComponent implements OnInit {
  currentUser: string = this.authService.getUser();
  email: string = this.authService.getEmail();
  changePassword = false;
  submitted = false;
  invalid = false;
  editForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router

    // private alertService: AlertService
    ) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      username: [this.currentUser, Validators.minLength(1)],
      email: [this.email, [Validators.minLength(1), Validators.email]],
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]]
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }
    // convenience getter for easy access to form fields
  get f() {
    return this.editForm.controls;
  }
  onSubmit() {
    console.log("Submit")
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
      this.invalid = true;
      console.log("invalid form")
      return;
    }
    console.log(this.editForm.value.username, this.editForm.value.email, this.editForm.value.currentPassword, this.editForm.value.newPassword, this.editForm.value.confirmPassword)
    this.userService.editProfile(
      this.editForm.value.username,
      this.editForm.value.email,
      this.editForm.value.currentPassword,
      this.editForm.value.newPassword,
      this.editForm.value.confirmPassword,
      this.authService.getId()
    );
    this.router.navigate(["/hidden/lobby"])
    // .pipe(first())
    // .subscribe(
    //   data => {
    //     this.alertService.success("Edit profile successful", true)
    //     this.router.navigate(["/hidden/lobby"]);
    //   },
    //   error=> {
    //     this.alertService.error(error);
    //   }
    // );
  }


  newPassword() {
    this.changePassword = !this.changePassword;
  }

}
