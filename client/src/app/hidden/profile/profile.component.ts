import { UserService } from 'src/app/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import User from 'src/app/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  viewUser: string
  user: UserProfile
  userId: string
  userName: string
  userWins: number
  userLosses: number
  userWinLossRatio: number

  constructor( 
    private route: ActivatedRoute,
    private userService: UserService
    ) { }

  getUser(searchUser: string){
    this.userService.getUser(searchUser).subscribe(res => {
      console.log(res)
      this.user = res
      this.updateValues();
    });
  }

  updateValues(){
    this.userId = this.user._id
    this.userName = this.user.name
    this.userWins = 12
    this.userLosses = 8
    this.userWinLossRatio = this.userWins / (this.userLosses + this.userWins)
  }

  addFriend(id: string){
    console.log("adding "+this.userName)
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.viewUser = params.get("user");
      this.getUser(this.viewUser);
    }) 
  }
}

export interface UserProfile {
  _id: string,
  name: string
}
