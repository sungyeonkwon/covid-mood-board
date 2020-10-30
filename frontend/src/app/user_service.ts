import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {first, map, shareReplay} from 'rxjs/operators';
import {User} from '../constants/constants';

// api endpoints: [GET] request

// users
// users/?age=1020
// users/?mood=joy
// users/?gender=female
const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly users$ = this.fetchUsers();

  constructor(
      private readonly http: HttpClient,
  ) {}

  addUser(user: User) {  // return type
    return this.http.post<User>(`https://covid-mood.world/submit`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  // TODO: add filtering query with query params
  private fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`https://covid-mood.world/users`)
        .pipe(first(), shareReplay(1));
  }
}
