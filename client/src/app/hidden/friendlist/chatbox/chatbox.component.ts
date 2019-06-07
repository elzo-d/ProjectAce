import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Friend } from '.././Friend';
import { FriendlistComponent } from '../friendlist.component';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

  
export class ChatboxComponent implements OnInit {
  @Output() messageEvent = new EventEmitter();
  @Input('friend') vriend: Friend;
  close: boolean = true;
  //message: string;
  messages: Message[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    //this.mockMessages();
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push({
          fromUser: true,
          text: message,
        });
      });
  }

  closingChat() {
    console.log("emit")
    this.messageEvent.emit();
    console.log(this.messageEvent)
  }

  mockMessages() {
    this.messages = [
      { fromUser: true, text:"hi" },
      { fromUser: false, text:"1" },
      { fromUser: true, text:"hi" },
      { fromUser: false, text:"2" },
      { fromUser: true, text:"hi" },
      { fromUser: false, text:"3" },
      { fromUser: true, text:"hi" },
      { fromUser: false, text:"4" },
    ]
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
    this.messages.push(
      {
        fromUser: true,
        text: typedText,
      }
    )

    this.chatService.sendMessage(typedText);
  }
}

interface Message {
  fromUser: boolean
  text: string
}
