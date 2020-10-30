import {Component} from '@angular/core';

import {genderOptions, User} from '../constants/constants';
import {UserService} from './user_service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.scss']
})
export class SubmitComponent {
  gender = genderOptions;
  // mood = moodOptions;

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

  constructor(private readonly userService: UserService) {}

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
