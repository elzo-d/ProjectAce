import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';

import {URL} from '../../../config';

@Injectable()
export class ChatService {
  private url = URL;
  private socket;
  messages: Message[] = [];
  window:any;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.socket = io(this.url);
    this.socket.on("new-message", (message) => {
      //console.log("message: " + message);
      this.recieveMessage(message);
    });
    this.window = <any> window;
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  recieveMessage(message: string) {
    let words = message.split(' ')
    let thisUser = false
    let date = new Date()

    // Check for current user
    if (words[0] == this.auth.getUser()) {
      thisUser = true
    }

    // Remove name from the message
    message = message.replace(words[0], '');

    if (message != " ") {
      this.messages.push({
        fromUser: thisUser,
        user: words[0],
        text: message,
        hour: (date.getHours() < 10 ? '0' : '') + date.getHours(),
        minutes: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
      })

      if("Notification" in this.window && !thisUser && !this.window.document.hasFocus()) {
        let permission = this.window.Notification.permission;
        if(permission === "granted") {
          console.log("Send notification");
          let noti = new this.window.Notification(words[0] + ": " + message);
        }
      }
    }
  }
}

interface Message {
  fromUser: boolean
  user: string
  text: string
  hour: string
  minutes: string
}
