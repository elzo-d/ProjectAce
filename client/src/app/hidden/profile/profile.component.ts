import { AuthService } from './../../auth/auth.service';
import { FriendService } from './../../friend.service';
import { UserService } from 'src/app/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import User from 'src/app/User';
import { StatsService } from './../../stats.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  viewUser: string
  user: UserProfile
  stats: UserStats

  currentUser: string = this.authService.getUser();
  email: string = this.authService.getEmail();

  userId: string
  userName: string
  userWins: number
  userLosses: number
  userWinLossRatio: number
  userSkillGroup: skillGroup
  userLevel: number
  levelProgress: number
  usersWithData: string[] = Array()
  userProfile: boolean

  constructor( 
    private route: ActivatedRoute,
    private userService: UserService,
    private statsService: StatsService,
    private friendService: FriendService,
    private authService: AuthService
    ) { }

  getUser(searchUser: string){
    this.userService.getUser(searchUser).subscribe(res => {
      this.user = res
      this.updateUserValues();
    });
  }

  testData(id: string){
    console.log(this.usersWithData)
    if(this.usersWithData.includes(id)){
      return
    }
    this.usersWithData.push(id)
    this.statsService.random(id)
    return
  }

  getStats(searchUser: string){
    this.testData(searchUser)
    this.statsService.getStatsById(searchUser).subscribe(res => {
      this.stats = res[0]
      this.updateStatValues();
    })
  }

  updateStatValues(){
    this.userWins = this.stats.wins
    this.userLosses = this.stats.losses
    this.userWinLossRatio = this.checkWinLoss(this.userWins, this.userLosses);
    this.userSkillGroup = this.getSkillGroup(this.userWinLossRatio)
    this.userLevel = Math.floor((this.userWins + this.userLosses) / 5)
    this.levelProgress = (this.userWins + this.userLosses)%5
  }
  updateUserValues(){
    this.userId = this.user._id
    this.userName = this.user.name
  }

  checkWinLoss(wins, losses){
    if(wins == 0){
      return 0
    } else if(losses == 0){
      return wins
    }else{
      return Math.round(wins / losses * 100) / 100
    }
  }

  getSkillGroup(winLossRatio: number){
    if(winLossRatio < 0.5){
      return skillGroup.ROOKIE
    } else if(winLossRatio < 1){
      return skillGroup.INTERMEDIATE
    } else if(winLossRatio <1.5){
      return skillGroup.ADVANCED
    } else {
      return skillGroup.EXPERT
    }
  }

  addFriend(id: string){
    console.log("adding "+this.userName)
    this.friendService.friendRequest(this.authService.getId(),id)
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.viewUser = params.get("user");
      this.getUser(this.viewUser);
      this.getStats(this.viewUser);
      this.userProfile = this.checkUserProfile(this.viewUser)
    }) 
   
  }

  checkUserProfile(viewUser: string) {
    if(viewUser == this.authService.getId()){
      return true
    } else{
      return false
    }
  }
}

export interface UserProfile {
  _id: string,
  name: string
}

export interface UserStats {
  draws: number,
  game: string,
  losses: number,
  wins: number,
  id: string
}

enum skillGroup {
  ROOKIE = "Rookie",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert"
}

