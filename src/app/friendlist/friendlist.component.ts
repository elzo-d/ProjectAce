import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.css']
})
export class FriendlistComponent implements OnInit {

  friends: Friend[];
  sortedFriends: Friend[];
  visible = true;
  order: string = 'id';
  reverse: boolean = false;

  constructor(private orderPipe: OrderPipe) { 
    this.sortedFriends = orderPipe.transform(this.friends, 'id');
    console.log(this.sortedFriends);
   }

  ngOnInit() {
    this.mockData();
  }

  mockData() {
    this.friends = [
      { id:1, name: 'friend1', status: Status.ONLINE },
      { id:2, name: 'friend2', status: Status.AWAY },
      { id:3, name: 'friend3', status: Status.OFFLINE },
      { id:4, name: 'friend4', status: Status.ONLINE },
      { id:5, name: 'friend5', status: Status.BUSY },
      { id:6, name: 'friend6', status: Status.OFFLINE },
      { id:7, name: 'friend7', status: Status.OFFLINE },
      { id:8, name: 'friend8', status: Status.ONLINE },
    ]
  }

  toggleList() {
    this.visible = !this.visible;
  }

  setOrder(value: string){
    if(this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

}

interface Friend {
  id: number;
  name: string;
  status: string;
}

enum Status {
  ONLINE = "Online",
  OFFLINE = "Offline",
  BUSY = "Busy",
  AWAY = "Away"
}
