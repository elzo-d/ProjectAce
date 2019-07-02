import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { URL } from "./config";

@Injectable({
  providedIn: "root"
})
export class FriendService {
  uri = URL + "/api/friend";

  constructor(private http: HttpClient) {}

  friendRequest(userId, friendId) {
    const body = {
      friendId: friendId
    };
    return this.http.post(`${this.uri}/${userId}/request`, body);
  }

  getRequests(userId) {
    return this.http.get(`${this.uri}/${userId}/request`);
  }

  acceptRequest(userId, friendId) {
    const body = {
      userId: friendId
    };
    return this.http.post(`${this.uri}/${userId}/request/accept`, body);
  }

  declineRequest(userId, friendId) {
    const body = {
      userId: friendId
    };
    return this.http.post(`${this.uri}/${userId}/request/decline`, body);
  }

  getFriends(userId) {
    return this.http.get(`${this.uri}/${userId}`);
  }
}
