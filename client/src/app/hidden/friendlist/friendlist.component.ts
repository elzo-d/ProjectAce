import {AuthService} from './../../auth/auth.service';
import {AuthGuardService} from './../../auth/auth-guard.service';
import {Component, OnInit} from '@angular/core';
import {OrderPipe} from 'ngx-order-pipe';
import {Friend} from './Friend';

enum ActiveTab {
  GENERAL_CHAT, FRIEND_LIST, SEARCH
}

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.css']
})
export class FriendlistComponent implements OnInit {
  players: Friend[];
  friends: Friend[];
  sortedFriends: Friend[];
  visible = true;
  order: string = 'id';
  reverse: boolean = false;
  itemARank: number = 4;
  itemBRank: number = 4;
  chatFriend: Friend;
  currentUser: string = this.auth.getUser();
  activeTab: ActiveTab;

  constructor(private orderPipe: OrderPipe, public auth: AuthService) {
    this.sortedFriends = orderPipe.transform(this.friends, 'id');
    this.activeTab = ActiveTab.GENERAL_CHAT;
  }

  get ActiveTab() { return ActiveTab; }

  ngOnInit() {
    this.mockData();
    this.setOrder('status');
  }

  messageFriend(friend: Friend) {
    this.chatFriend = friend;
  }

  mockData() {
    this.friends = [
      {id: 1, name: 'friend1', status: Status.ONLINE},
      {id: 2, name: 'friend2', status: Status.AWAY},
      {id: 3, name: 'friend3', status: Status.OFFLINE},
      {id: 4, name: 'friend4', status: Status.ONLINE},
      {id: 5, name: 'friend5', status: Status.BUSY},
      {id: 6, name: 'friend6', status: Status.OFFLINE},
      {id: 7, name: 'friend7', status: Status.OFFLINE},
      {id: 8, name: 'friend8', status: Status.ONLINE},
    ];
    this.players = [
      {id: 1, name: 'player1', status: Status.OFFLINE},
      {id: 2, name: 'player2', status: Status.OFFLINE},
      {id: 3, name: 'player3', status: Status.OFFLINE},
      {id: 4, name: 'player4', status: Status.ONLINE},
      {id: 5, name: 'player5', status: Status.AWAY},
      {id: 6, name: 'player6', status: Status.BUSY},
      {id: 7, name: 'player7', status: Status.ONLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
      {id: 3, name: 'player3', status: Status.OFFLINE},
      {id: 4, name: 'player4', status: Status.ONLINE},
      {id: 5, name: 'player5', status: Status.AWAY},
      {id: 6, name: 'player6', status: Status.BUSY},
      {id: 7, name: 'player7', status: Status.ONLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
      {id: 3, name: 'player3', status: Status.OFFLINE},
      {id: 4, name: 'player4', status: Status.ONLINE},
      {id: 5, name: 'player5', status: Status.AWAY},
      {id: 6, name: 'player6', status: Status.BUSY},
      {id: 7, name: 'player7', status: Status.ONLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
      {id: 3, name: 'player3', status: Status.OFFLINE},
      {id: 4, name: 'player4', status: Status.ONLINE},
      {id: 5, name: 'player5', status: Status.AWAY},
      {id: 6, name: 'player6', status: Status.BUSY},
      {id: 7, name: 'player7', status: Status.ONLINE},
      {id: 8, name: 'player8', status: Status.OFFLINE},
      {id: 9, name: 'player9', status: Status.AWAY},
      {id: 10, name: 'player10', status: Status.OFFLINE},
    ]
  }

  toggleList() {
    this.visible = !this.visible;
  }

  activateTab(parameter: ActiveTab) {
    this.activeTab = parameter;
  }

  closeChat() {
    console.log("closing")
    this.chatFriend = undefined;
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  customComparator(itemA, itemB) {
    let itemARank = 4;
    let itemBRank = 4;

    if (itemA == Status.ONLINE) {
      itemARank = 1;
    }
    if (itemB == Status.ONLINE) {
      itemBRank = 1;
    }
    if (itemA == Status.AWAY) {
      itemARank = 2;
    }
    if (itemB == Status.AWAY) {
      itemBRank = 2;
    }
    if (itemA == Status.BUSY) {
      itemARank = 3;
    }
    if (itemB == Status.BUSY) {
      itemBRank = 3;
    }
    if (itemA == Status.OFFLINE) {
      itemARank = 4;
    }
    if (itemB == Status.OFFLINE) {
      itemBRank = 4;
    }
    return itemARank > itemBRank ? 1 : -1;
  }

}

enum Status {
  ONLINE = "Online",
  OFFLINE = "Offline",
  BUSY = "Busy",
  AWAY = "Away"
}
