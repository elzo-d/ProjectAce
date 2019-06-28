import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { URL } from './config';

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

  getRequests(user_id) {
    //! Return friend requests for user(requester_name, requester_id, request_id)
  }

  acceptRequest(request_id) {
    //! Send accept to server
  }

  declineRequest(request_id) {
    //! Send decline to server
  }

  getFriends(user_id) {
    //! Return list of friends(name, id, status)
  }
}
