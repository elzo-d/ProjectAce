import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from './../../../auth/auth.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-generalchat',
  templateUrl: './generalchat.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class GeneralchatComponent implements OnInit {
  @Output() messageEvent = new EventEmitter();
  close: boolean = true;
  messages: Message[] = [];
  currentUser: string = this.auth.getUser();

  constructor(private chatService: ChatService, public auth: AuthService) {}

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.recieveMessage(message)
      })
  }

  recieveMessage(message: string) {
    let words = message.split(' ')
    let thisUser = false
    
    if(words[0] == this.currentUser){
      thisUser = true
      message = message.replace(this.currentUser,'');
    }

    this.messages.push({
      fromUser: thisUser,
      text: message
    })
  }

  closingChat() {
    console.log("emit")
    this.messageEvent.emit();
    console.log(this.messageEvent)
  }

  getStyle(user: boolean){
    if(user){
      return "me"
    }
    else{
      return "other"
    }
  }

  sendMessage(typedText: string): void {
    this.chatService.sendMessage(this.currentUser + " " + typedText);
  }
}

interface Message {
  fromUser: boolean
  text: string
}
