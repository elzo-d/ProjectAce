import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-hidden',
  templateUrl:'hidden.component.html',
  styleUrls: ['./hidden.component.css']
})
export class HiddenComponent implements OnInit {

  constructor(private authservice:AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authservice.logout()
  }

  // Reset all components to their origional state
  resetAllComponents() {
    document.getElementById("friendlist").style.setProperty("display", "none");
    document.getElementById("body").style.setProperty("display", "unset");
  }

  // Make the FriendlistComponent visible again
  toggleFriendComponent() {
    this.resetAllComponents()
    document.getElementById("friendlist").style.setProperty("display", "unset");
    document.getElementById("body").style.setProperty("display", "none");
  }

  removeFriendComponent() {
    this.resetAllComponents()
    document.getElementById("friendlist").style.setProperty("display", "none");
  }

}
