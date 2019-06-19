import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

export class ChatService {
  private url = 'http://localhost:5000';
  private socket;
  messages: Message[] = [];

  constructor() {
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