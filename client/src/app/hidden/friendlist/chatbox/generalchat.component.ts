import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {AuthService} from './../../../auth/auth.service';
import {ChatService} from './chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-generalchat',
  templateUrl: './generalchat.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class GeneralchatComponent implements OnInit {
  @Output() messageEvent = new EventEmitter();
  close: boolean = true;
  currentUser: string = this.auth.getUser();
  window: any;

  constructor(public chatService: ChatService, public auth: AuthService) {}

  ngOnInit() {
    this.window = <any> window;

    if("Notification" in this.window) {
      let permission = this.window.Notification.permission;
      if(permission !== "granted" && permission !== "denied") {
        console.log("Requesting permission for notifications...");
        this.window.Notification.requestPermission(per => {
          if(per === "granted") {
            let noti = new this.window.Notification("Notifications enabled");
          }
        });
      }
    }
  }

  closingChat() {
    console.log("emit")
    this.messageEvent.emit();
    console.log(this.messageEvent)
  }

  getStyle(user: boolean) {
    if (user) {
      return "me"
    }
    else {
      return "other"
    }
  }

  sendMessage(typedText: string): void {
    this.chatService.sendMessage(this.currentUser + " " + typedText);
  }
}
