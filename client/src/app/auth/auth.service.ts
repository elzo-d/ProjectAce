import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";

import * as moment from "moment";
import { JsonPipe } from "@angular/common";

import { URL } from "../config";

const API_URL = URL + "/api/";

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
    return moment().isBefore(this.getExpiration());
  }

  private setSession(authResult) {
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
  }

  public getExpiration() {
    return JSON.parse(localStorage.getItem("expirationTime"));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem("name"));
  }

  public getId() {
    return JSON.parse(localStorage.getItem("id"));
  }
  public getEmail() {
    return JSON.parse(localStorage.getItem("email"));
  }

  private handleError(error) {
    console.log(error);
  }
}

interface User {
  name: String;
  password: String;
  email: String;
  id: string;
}
