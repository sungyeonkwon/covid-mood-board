import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {first, map, shareReplay} from 'rxjs/operators';
import {User} from '../constants/constants';
import {environment} from '../environments/environment';

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
  private readonly words$ = this.fetchWords();
  shouldFetchNew = false;
  constructor(
      private readonly http: HttpClient,
  ) {}

  addUser(user: User) {  // return type
    return this.http.post<User>(`${environment.baseApi}/create`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  getWords(): Observable<User[]> {
    return this.words$;
  }

  // TODO: add filtering query with query params
  fetchUsers(): Observable<User[]> {
    return this.http.get<any>(`${environment.baseApi}/users`)
        .pipe(first(), shareReplay(1));
  }

  // TODO: add filtering query with query params
  fetchWords(): Observable<User[]> {
    return this.http.get<any>(`${environment.baseApi}/words`)
        .pipe(first(), shareReplay(1));
  }
}
