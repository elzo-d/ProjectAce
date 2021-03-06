import { UserProfile } from './hidden/profile/profile.component';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL } from './config';

@Injectable({
  providedIn: "root"
})
export class UserService {
  uri = URL + "/api/user";

  constructor(private http: HttpClient) {}

  register(name, password, email) {
    console.log("Registering");
    const user = {
      name: name,
      password: password,
      email: email
    };
    return this.http.post(`${this.uri}/add`, user);
  }

  editProfile(name, email, currentPassword, newPassword, confirmPassword, id) {
    console.log("submitting");
    const user = {
      name: name,
      password: newPassword,
      email: email,
      currentPassword: currentPassword
    };
    console.log(user);
    this.http
      .post(`${this.uri}/update/${id}`, user)
      .subscribe(res => console.log("Done"));
  }

  getPlayerList() {
    return this.http.get(`${this.uri}`);
  }

  getUser(userId: string){
    console.log("trying to get user")
    return this.http.get<UserProfile>(`${this.uri}/${userId}`)
  }
}
