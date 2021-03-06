import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../constants/constants';

import {UserService} from './user_service';

@Injectable({providedIn: 'root'})
export class UserResolver implements Resolve<User[]|undefined> {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<User[]> {
    if (this.userService.shouldFetchNew) {
      // this.userService.shouldFetchNew = false;
      // TODO: put sessionStorage in that, if a map(or root) + list is visited,
      // then this should be false;
      return this.userService.fetchUsers();
    } else {
      return this.userService.getAllUsers();
    }
  }
}
