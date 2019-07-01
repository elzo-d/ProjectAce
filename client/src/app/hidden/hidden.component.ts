import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-hidden',
  templateUrl:'hidden.component.html',
  styleUrls: ['./hidden.component.css']
})
export class HiddenComponent implements OnInit {

  constructor(
    private authservice:AuthService, 
  ) {
    window.onresize = () => {this.onResize()};
  }

  ngOnInit() {
  }

  onResize() {
    this.checkWidth();
  }

  public checkWidth() {
    var width = window.innerWidth;
    if (width <= 600) { // Mobile view
      this.resetAllComponents()
    } else { // Normal view
      this.setComponentsWebView()
    }
  }

  logout() {
    this.authservice.logout()
  }

  // Set the compontens to web view
  setComponentsWebView(){
    document.getElementById("friendlist").style.setProperty("display", "unset");
    document.getElementById("body").style.setProperty("display", "unset");
  }

  // Reset all components to their origional state
  resetAllComponents() {
    document.getElementById("friendlist").style.setProperty("display", "none");
    document.getElementById("body").style.setProperty("display", "unset");
  }

  // Make the FriendlistComponent visible again
  activateFriendComponent() {
    this.resetAllComponents()
    document.getElementById("friendlist").style.setProperty("display", "unset");
    document.getElementById("body").style.setProperty("display", "none");
  }

  // removeFriendComponent() {
  //   this.resetAllComponents()
  //   document.getElementById("friendlist").style.setProperty("display", "none");
  // }

}
