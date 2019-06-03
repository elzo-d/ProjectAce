import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  messages: Message[];
  constructor() { }

  ngOnInit() {
    this.mockMessages();
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
  }
}

interface Message {
  fromUser: boolean
  text: string
}
