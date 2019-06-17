import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  uri = "http://localhost:5000/api/user";

  constructor(private http: HttpClient) {}

  register(name, password) {
    console.log("Registering");
    const user = {
      name: name,
      password: password
    };
    return this.http.post(`${this.uri}/add`, user);
  }
}
