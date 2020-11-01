import {Component} from '@angular/core';
import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import {pairwise} from 'rxjs/operators';

import {genderOptions, Mood, User} from '../constants/constants';
import {UserService} from '../shared/user_service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.scss']
})
export class SubmitComponent {
  genderOptions = genderOptions;
  moodRef = Mood;
  moods$ = new Subject<Mood>();

  user: User = {
    id: 1,
    created_date: 'some date',
    isAnonymous: false,
    age: 12,
    mood: 'joy',
    profession: 'profession',
    gender: 'female',
    name: 'name',
    coords: 'some coords',
    message: 'NEW MESSAGE',
  }

  submitted = false;

  constructor(private readonly userService: UserService) {
    this.moods$.pipe(pairwise()).subscribe((data) => {
      console.log('Subscriber A:', data);
    });
  }

  hasMoodAlready(currentMoodArray, mood) {}

  addMood(mood: Mood) {
    this.moods$.next(mood);

    // console.log(this.moods$.getValue());
  }

  submit() {
    console.log('post');
    this.submitted = true;
    this.userService.addUser(this.user).subscribe(() => {console.log('??')});
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    console.log('gender', this.gender)
    return JSON.stringify(this.user);
  }
}

// just use angular material form
// http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8
