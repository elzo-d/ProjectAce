import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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

  constructor(private chatService: ChatService) {}

  ngOnInit() {
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

  getStyle(user: boolean){
    if(user){
      return "me"
    }
    else{
      return "other"
    }
  }

  sendMessage(typedText: string): void {
    // this.messages.push(
    //   {
    //     fromUser: true,
    //     text: typedText,
    //   }
    // )

    this.chatService.sendMessage(typedText);
  }
}

interface Message {
  fromUser: boolean
  text: string
}
