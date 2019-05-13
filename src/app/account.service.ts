import { Injectable } from '@angular/core';
import { User } from './_models'
import { RouteConfigLoadEnd } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  userList: User[] = [
    {
      id: 0,
      username: 'coolkid94',
      password: 'cookies',
      firstName: 'Leon',
      lastName: 'Smit',
      token: '233244'
    },
    {
      id: 1,
      username: 'knoalboy',
      password: 'supersecurepassword',
      firstName: 'Jarco',
      lastName: 'Uil',
      token: '132123'
    },
    {
      id: 0,
      username: 'elzUser',
      password: 'jup',
      firstName: 'Elzo',
      lastName: 'Doornbos',
      token: '2234234'
    },
    {
      id: 0,
      username: 'parkieteigenaar',
      password: 'uhum',
      firstName: 'Thom',
      lastName: 'van Dijk',
      token: '1235665'
    }
  ];

  getUserByName(username: string): Observable<User> {
    return of(this.userList.find(user => user.username === username));
  }

  constructor() { }
}

// !id: number;
// !username: string;
// !password: string;
// !firstName: string;
// !lastName: string;
// !token: string;
