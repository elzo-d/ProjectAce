import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models'
import { AccountService } from '../account.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.username = username;
    this.accountService.getUserByName(username).subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }
}
