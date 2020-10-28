import {Component} from '@angular/core';

export interface User {
  id: number;
  isAnonymous: boolean;
  mood: string;
  message: string;
  name?: string;
  age?: number;
  gender?: string;
}

const gender = [
  'Female',
  'Male',
  'Other',
];

@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.scss']
})
export class SubmitComponent {
  gender = gender;

  user: User = {
    id: 1,
    isAnonymous: false,
    mood: 'Joy',
    message: 'skefnalwkfna alwkfalkna alkwnd',
  }

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    console.log('gender', this.gender)
    return JSON.stringify(this.user);
  }
}

// just use angular material form
// http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8
