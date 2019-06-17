import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  navbarItem1: string = "active";
  navbarItem2: string = "unactive";

  ngOnInit() {}

  logout() {
    console.log("hier");
    this.authService.logout();
  }

  toggleClass(index: number) {
    if (index == 1) {
      this.navbarItem2 = "unactive";
      this.navbarItem1 = "active";
    } else if (index == 2) {
      this.navbarItem2 = "active";
      this.navbarItem1 = "unactive";
    }
    console.log("toggling!");
  }
}
