import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";

import * as moment from "moment";
import { JsonPipe } from '@angular/common';

const API_URL = "http://localhost:5000/api/";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(name: string, password: string) {
    return this.http.post<User>(API_URL + "login", { name, password }).pipe(
      tap(res => this.setSession(res), err => this.handleError(err)),
      shareReplay()
    );
  }

  public isLoggedIn() {
    console.log(JSON.parse(localStorage.getItem("name")));
    return moment().isBefore(this.getExpiration());
  }

  private setSession(authResult) {
    console.log(authResult)
    localStorage.setItem(
      "expirationTime",
      JSON.stringify(authResult.expiresIn + moment.now())
    );
    localStorage.setItem("idToken", JSON.stringify(authResult.token));
    localStorage.setItem("name", JSON.stringify(authResult.user));
    localStorage.setItem("email", JSON.stringify(authResult.email));
    localStorage.setItem("id", JSON.stringify(authResult.id));

  }

  public logout() {
    localStorage.clear();
    console.log("Logging out");
  }

  public getExpiration() {
    console.log("Get experiation as json...");
    return JSON.parse(localStorage.getItem("expirationTime"));
  }

  public getUser() {
    console.log("Get user...");
    return JSON.parse(localStorage.getItem("name"));
  }

  public getId(){
    console.log("Get id...");
    return JSON.parse(localStorage.getItem("id"));
  }
  public getEmail() {
    console.log("Get email...");
    return JSON.parse(localStorage.getItem("email"));
  }

  private handleError(error) {
    console.error("ERROR...");
    console.log(error);
  }
}

interface User {
  name: String;
  password: String;
  email: String;
  id: string;
}
