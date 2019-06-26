import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserStats } from './hidden/profile/profile.component';

@Injectable({
  providedIn: "root"
})
export class StatsService {
  uri = "http://localhost:5000/api/stats";

  constructor(private http: HttpClient) {}

  random(userId) {
    this.http.post(`${this.uri}/random/${userId}`, null).subscribe(res => {
      console.log("done");
    });
  }

  getStatsById(userId) {
    console.log(userId);
    return this.http.get<UserStats>(`${this.uri}/${userId}`);
  }

  getStatsByGame(game) {
    return this.http.get(`${this.uri}/game/${game}`);
  }
}
