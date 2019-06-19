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
  date: Date;

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
    this.date = new Date()
    
    // Check for current user
    if(words[0] == this.currentUser){
      thisUser = true
    }

    // Remove name from the message
    message = message.replace(words[0],'');

    if(message != " "){
      this.messages.push({
        fromUser: thisUser,
        user: words[0],
        text: message,
        hour: (this.date.getHours() < 10 ? '0' : '') + this.date.getHours(),
        minutes: (this.date.getMinutes() < 10 ? '0' : '') + this.date.getMinutes()
      })
    }
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
  user: string
  text: string
  hour: string
  minutes: string
}
