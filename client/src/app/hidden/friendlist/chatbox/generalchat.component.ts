import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {AuthService} from './../../../auth/auth.service';
import {ChatService} from './chat.service';
import {Subscription} from 'rxjs';
import {SwUpdate, SwPush} from '@angular/service-worker';

@Component({
  selector: 'app-generalchat',
  templateUrl: './generalchat.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class GeneralchatComponent implements OnInit, OnDestroy {
  @Output() messageEvent = new EventEmitter();
  readonly VAPID_PUBLIC_KEY = "BOeUCIce-rGD5dA9g6qT455oAnvKU1AFzQU8eixLWlGVuHzFZSHjqymYIzjYN7Sh7Kqxk9AoHoCBgpSgM9Tes60";
  close: boolean = true;
  currentUser: string = this.auth.getUser();
  date: Date;
  private subscription: Subscription;

  constructor(
    public chatService: ChatService,
    public auth: AuthService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
  ) {
    this.subscribeToNotifications();
  }

  ngOnInit() {
    this.subscription = this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.recieveMessage(message)
      })

    // For something with updated push notifications
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {
    //     if (confirm("New version available. Load New Version?")) {
    //       window.location.reload();
    //     }
    //   });
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this.chatService.addPushSubscriber(sub).subscribe())
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  recieveMessage(message: string) {
    let words = message.split(' ')
    let thisUser = false
    this.date = new Date()

    // Check for current user
    if (words[0] == this.currentUser) {
      thisUser = true
    }

    // Remove name from the message
    message = message.replace(words[0], '');

    if (message != " ") {
      this.chatService.messages.push({
        fromUser: thisUser,
        user: words[0],
        text: message,
        hour: (this.date.getHours() < 10 ? '0' : '') + this.date.getHours(),
        minutes: (this.date.getMinutes() < 10 ? '0' : '') + this.date.getMinutes()
      })

      this.chatService.send()
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
