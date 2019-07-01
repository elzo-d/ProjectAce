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
}

interface Message {
  fromUser: boolean
  user: string
  text: string
  hour: string
  minutes: string
}
