import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user.service";

@Component({
  selector: "login",
  providers: [AuthService],
  templateUrl: "login.component.html",
  styleUrls: ['./../app.component.css']
})
export class LoginComponent {
  form: FormGroup;
  errorColor: String = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"]);
    }

    this.form = this.fb.group({
      name: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    if (val.name && val.password) {
      this.authService.login(val.name, val.password).subscribe(
        () => {
          console.log("User is logged in");
          this.router.navigate(["hidden/lobby"]);
          return;
        },
        () => {
          console.error("FOUT: ongeldige gegevens");
          this.errorColor = "#ffccff";
        }
      );
    }

    // console.log("Starting registering");
    // this.userService.register(val.name, val.password, val.email);
  }
}
