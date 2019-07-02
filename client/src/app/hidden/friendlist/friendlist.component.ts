import { HiddenComponent } from "./../hidden.component";
import { AuthService } from "./../../auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { OrderPipe } from "ngx-order-pipe";
import { Friend } from "./Friend";
import { UserService } from "src/app/user.service";
import { Router } from "@angular/router";
import { FriendService } from "src/app/friend.service";

enum ActiveTab {
  GENERAL_CHAT,
  FRIEND_LIST,
  SEARCH
}

@Component({
  selector: "app-friendlist",
  templateUrl: "./friendlist.component.html",
  styleUrls: ["./friendlist.component.css"]
})
export class FriendlistComponent implements OnInit {
  players: Friend[];
  displayPlayers: Friend[];
  friends: Friend[];
  sortedFriends: Friend[];
  receivedRequests: String[];
  visible = true;
  order: string = "id";
  reverse: boolean = false;
  itemARank: number = 4;
  itemBRank: number = 4;
  chatFriend: Friend;
  currentUser: string = this.auth.getUser();
  activeTab: ActiveTab;

  constructor(
    private orderPipe: OrderPipe,
    public auth: AuthService,
    private userService: UserService,
    private router: Router,
    private hiddenComp: HiddenComponent,
    private friendService: FriendService
  ) {
    this.sortedFriends = orderPipe.transform(this.friends, "id");
    this.activeTab = ActiveTab.GENERAL_CHAT;
  }

  get ActiveTab() {
    return ActiveTab;
  }

  ngOnInit() {
    this.updatePlayerList();
    this.setOrder("status");
    this.getFriendRequests();
  }

  messageFriend(friend: Friend) {
    this.chatFriend = friend;
  }

  viewMobileProfile() {
    this.hiddenComp.resetAllComponents();
  }

  updatePlayerList() {
    this.userService.getPlayerList().subscribe(res => {
      this.players = [];
      for (let i in res) {
        let user = res[i];
        if (user._id !== this.auth.getId()) {
          this.players.push({
            id: user._id,
            name: user.name
            // status: Status.ONLINE
          });
        }
      }
      this.searchUser("");

      this.getFriends();
    });
  }

  getFriends() {
    this.friendService.getFriends(this.auth.getId()).subscribe(res => {
      let players = this.players;
      this.friends = [];
      for (let i in res) {
        let id = res[i];
        let player = players.find(player => player.id === id);
        if (player) {
          this.friends.push({
            id: id,
            name: player.name
          });
        }
      }
    });
  }

  sendFriendRequest(receiverId) {
    this.friendService
      .friendRequest(this.auth.getId(), receiverId)
      .subscribe(res => {});
    this.updatePlayerList();
  }

  getFriendRequests() {
    this.friendService.getRequests(this.auth.getId()).subscribe(res => {
      this.receivedRequests = [];
      for (let i in res) {
        this.receivedRequests.push(res[i]);
      }
    });
  }

  acceptRequest(friendId) {
    this.friendService
      .acceptRequest(this.auth.getId(), friendId)
      .subscribe(res => this.getFriendRequests());
    this.updatePlayerList();
  }

  declineRequest(friendId) {
    this.friendService
      .declineRequest(this.auth.getId(), friendId)
      .subscribe(res => this.getFriendRequests());
    this.updatePlayerList();
  }

  // mockData() {
  //   this.friends = [
  //     { id: 1, name: "friend1", status: Status.ONLINE },
  //     { id: 2, name: "friend2", status: Status.AWAY },
  //     { id: 3, name: "friend3", status: Status.OFFLINE },
  //     { id: 4, name: "friend4", status: Status.ONLINE },
  //     { id: 5, name: "friend5", status: Status.BUSY },
  //     { id: 6, name: "friend6", status: Status.OFFLINE },
  //     { id: 7, name: "friend7", status: Status.OFFLINE },
  //     { id: 8, name: "friend8", status: Status.ONLINE }
  //   ];
  // }

  toggleList() {
    this.visible = !this.visible;
    this.updatePlayerList();
  }

  activateTab(parameter: ActiveTab) {
    this.activeTab = parameter;
    this.updatePlayerList();
  }

  closeChat() {
    this.chatFriend = undefined;
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  searchUser(searchString: string) {
    this.displayPlayers = [];
    for (let player of this.players) {
      if (player.name.includes(searchString)) {
        this.displayPlayers.push(player);
      }
    }
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
