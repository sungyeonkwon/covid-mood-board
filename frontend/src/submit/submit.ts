import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BehaviorSubject, of, ReplaySubject, Subject} from 'rxjs';
import {catchError, finalize, pairwise, scan, tap, timeout} from 'rxjs/operators';

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

  isLoading = false;

  constructor(
      private readonly userService: UserService,
      private readonly fb: FormBuilder,
      private readonly router: Router,
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

    this.moodForm.valueChanges.subscribe(val => {  // console.log('val', val);
      console.log('@', this.moodForm);
    });
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

    this.isLoading = true;

    const user = {
      ...moodForm.value,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    this.userService.addUser(user)
        .pipe(
            tap(() => {
              console.log('this.isLoading', this.isLoading);
              this.isLoading = true;
              console.log('this.isLoading', this.isLoading);
            }),
            catchError(error => {
              console.log('Error while adding a mood: ', error);
              return of([])
            }),
            finalize(() => this.isLoading = false))
        .subscribe(() => {
          this.router.navigate(['map']);
        });
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
