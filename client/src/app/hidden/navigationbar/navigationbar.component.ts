import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import {HiddenComponent} from '../hidden.component';

@Component({
  selector: "app-navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  currentUser: string = this.authService.getUser();

  constructor(private authService: AuthService, private hiddenComp: HiddenComponent) {}

  ngOnInit() {}

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
