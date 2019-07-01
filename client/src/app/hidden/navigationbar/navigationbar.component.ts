import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { HiddenComponent } from '../hidden.component';
import { GameDataService } from '../game-data.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  currentUser: string = this.authService.getUser();
  currentUserId: string = this.authService.getId();

  constructor(
    private authService: AuthService,
    private hiddenComp: HiddenComponent,
    private gameDataService: GameDataService,
    private router:Router
  ) {}

  ngOnInit() {}

  toHome() {
    this.router.navigateByUrl("/hidden/lobby");
    this.gameDataService.deselectGame();
  }

  logout() {
    this.authService.logout();
  }

  resetAllComponents(){
    this.hiddenComp.resetAllComponents();
  }

  toggleFriendComponent() {
    this.hiddenComp.toggleFriendComponent();
  }
}
