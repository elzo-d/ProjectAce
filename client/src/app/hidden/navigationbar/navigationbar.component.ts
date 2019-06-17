import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css']
})
export class NavigationbarComponent implements OnInit {

  navbarItem1: string = "active"
  navbarItem2: string = "unactive"

  constructor() { }

  ngOnInit() {
  }

  toggleClass(index: number){
    if(index == 1){
      this.navbarItem2 = "unactive"
      this.navbarItem1 = "active"
    }else if(index == 2){
      this.navbarItem2 = "active"
      this.navbarItem1 = "unactive"

    }
    console.log("toggling!");
  }

}
