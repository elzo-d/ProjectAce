import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserStats } from './hidden/profile/profile.component';
import { URL } from './config';

@Injectable({
  providedIn: "root"
})
export class StatsService {
  uri = URL + "/api/stats";

  constructor(private http: HttpClient) {}

  random(userId) {
    this.http.post(`${this.uri}/random/${userId}`, null).subscribe(res => {
      console.log("done");
    });
  }

  getStatsById(userId) {
    return this.http.get<UserStats>(`${this.uri}/${userId}`);
  }

  getStatsByGame(game) {
    return this.http.get(`${this.uri}/game/${game}`);
  }
}
