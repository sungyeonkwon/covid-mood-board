import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import {pairwise, scan} from 'rxjs/operators';

import {genderOptions, Mood, User} from '../constants/constants';
import {UserService} from '../shared/user_service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.scss']
})
export class SubmitComponent implements OnInit {
  genderOptions = genderOptions;

  moodRef = Mood;
  selectedMood$ = new BehaviorSubject<Mood>(Mood.UNDEFINED);  // type

  moodForm: FormGroup;

  showErrorMessage = false;

  constructor(
      private readonly userService: UserService,
      private readonly fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.moodForm = this.fb.group({
      name: [
        '',
      ],
      age: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.min(5),
        ]
      ],
      gender: [''],
      profession: [''],
      message: ['', Validators.required],  // Validators.minLength(15)
      mood: [this.selectedMood$.getValue(), Validators.required],
      is_anonymous: [false, Validators.required],
    });

    // this.moodForm.valueChanges.subscribe(
    //     val => {
    //         // console.log('val', val);
    //     });
  }

  addMood(mood: Mood) {
    this.selectedMood$.next(mood);
    this.moodForm.patchValue({mood});
  }

  private isFormIncomplete(form) {
    const isUserInfoIncomplete = !form.value.name || !form.value.age ||
        !form.value.profession || !form.value.gender;
    return !form.value.is_anonymous && isUserInfoIncomplete
  }

  async onSubmit(moodForm) {
    if (this.isFormIncomplete(moodForm)) {
      this.showErrorMessage = true;
      return;
    }

    const coords = await this.getGeolocation();

    const user = {
      ...moodForm.value,
      latitude: coords.latitude,    // check the order
      longitude: coords.longitude,  // check the order
    };

    this.userService.addUser(user).subscribe(() => {console.log('??')});
  }

  private getGeolocation(): any {
    const onSuccess = (position) => position.coords;
    // handle errors
    const onError = (error) => console.log('unble to retrive', error);

    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
          (position) => resolve(onSuccess(position)),
          (error) => reject(onError(error)));
    })
  }
}
