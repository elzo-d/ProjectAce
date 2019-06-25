import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import User from 'src/app/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User
  viewUser: String
  constructor( private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.viewUser = params.get("user");
    })

  }

}
