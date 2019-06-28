import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';

import {URL} from '../../../config';

@Injectable()
export class ChatService {
  private url = URL;
  private socket;
  messages: Message[] = [];

  constructor(private http: HttpClient) {
    this.socket = io(this.url);
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  addPushSubscriber(sub: any) {
    console.log("User subscribed to push notifications!")
    return this.http.post(this.url + '/api/notifications', sub);
  }

  send() {
    console.log("New push notification!")
    return this.http.post(this.url + '/api/newsletter', null);
  }
}

interface Message {
  fromUser: boolean
  user: string
  text: string
  hour: string
  minutes: string
}
