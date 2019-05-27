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
  itemARank: number = 4;
  itemBRank: number = 4;


  constructor(private orderPipe: OrderPipe) { 
    this.sortedFriends = orderPipe.transform(this.friends, 'id');
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

  customComparator(itemA, itemB) {
    let itemARank = 4;
    let itemBRank = 4;

    if(itemA == Status.ONLINE){
      itemARank = 1;
    }
    if(itemB == Status.ONLINE){
      itemBRank = 1;
    }
     if(itemA == Status.AWAY){
      itemARank = 2;
    }
    if(itemB == Status.AWAY){
      itemBRank = 2;
    }
    if(itemA == Status.BUSY){
      itemARank = 3;
    }
    if(itemB == Status.BUSY){
      itemBRank = 3;
    }
    if(itemA == Status.OFFLINE){
      itemARank = 4;
    }
    if(itemB == Status.OFFLINE){
      itemBRank = 4;
    }
    return itemARank > itemBRank ? 1 : -1;
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
