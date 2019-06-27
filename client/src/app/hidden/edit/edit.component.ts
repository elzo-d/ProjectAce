import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user.service";
import { AuthService } from "../../auth/auth.service";
import { AlertService } from "../../alert.service";
import { Router } from "@angular/router";
import { PasswordValidation } from './password-validation';
import {Location} from '@angular/common';


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
  invalidForm = true;
  editForm: FormGroup;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _location: Location
    ) { }

  ngOnInit() {
    // initialize the form
    this.editForm = this.formBuilder.group({
      username: [this.currentUser, [Validators.required, Validators.maxLength(16)]],
      email: [this.email, [Validators.required, Validators.email]],
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

 formError() {
   //  check form requirements 
   if(this.editForm.get('username').hasError('required')){
     console.log("username required")
     return false
   } else if(this.editForm.get('username').hasError('maxlength')) {
     console.log("No longer than 16 charachters")
     return false
   } else if (this.editForm.get('email').hasError('required')){
    console.log("email required") 
    return false
   } else if(this.editForm.get('email').hasError('email')){
    console.log("Valid email please")
     return false
   }
   return true
  }

  backClicked() {
    this._location.back();
  }
  
  submitWithoutPassword() {
    // Submit the form without a changed password
    console.log("no password")
    this.userService.editProfile(
      this.editForm.value.username,
      this.editForm.value.email,
      undefined,
      undefined,
      undefined,
      this.authService.getId()
      );
      this.invalidForm = false;
      this.router.navigate(["/hidden/lobby"])
  }

  submitWithPassword(){
    // submit form with the changed password
    this.userService.editProfile(
      this.editForm.value.username,
      this.editForm.value.email,
      this.editForm.value.currentPassword,
      this.editForm.value.newPassword,
      this.editForm.value.confirmPassword,
      this.authService.getId()
    );
  }
  
  onSubmit() {
    this.invalidForm = true;
    console.log("Submit")
    this.submitted = true;
    this.logForm();
    if (!this.changePassword && this.formError()){
      this.submitWithoutPassword();
    } else if (this.editForm.invalid) {
      this.invalid = true;
      console.log("invalid form")
    } else {
      this.submitWithPassword();
    }
  }

  newPassword() {
    this.changePassword = !this.changePassword;
  }

  logForm() {
    console.log(this.editForm.value.username, this.editForm.value.email, this.editForm.value.currentPassword, this.editForm.value.newPassword, this.editForm.value.confirmPassword)
  }

}
