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
  moodsource$ = new Subject<any>();  // type
  moods$ = this.moodsource$.pipe(scan(([acc, item]) => [...acc, item], []));


  submitted = false;

  moodForm: FormGroup;

  constructor(
      private readonly userService: UserService,
      private readonly fb: FormBuilder,
  ) {
    this.moods$.pipe().subscribe((data) => {
      console.log('Subscriber A:', data);
    });
  }

  ngOnInit() {
    this.moodForm = this.fb.group({
      name: ['', Validators.required],
      age: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]\d*$'),
        ]
      ],
      gender: [''],
      profession: [''],
      message: ['', [Validators.required]],  // Validators.minLength(15)
      // mood: ['', Validators.required],
      is_anonymous: [false],
    });

    this.moodForm.valueChanges.subscribe(
        val => {// console.log('val', val);
                console.log('form', this.moodForm)});
  }

  toggleMood(mood: Mood) {
    // this.moodsource$.next(mood);
    this.moods$.subscribe(moods => {
      console.log('moods', moods)
      if (moods.includes(mood)) {
        this.moods$.next(mood.filter(item => item !== mood));
        this.moodsource$.next(undefined);
      }
      else {
        this.moodsource$.next(mood);
      }
    })
  }

  async onSubmit(moodForm) {
    const coords = await this.getGeolocation();

    const user = {
      ...moodForm.value,
      coords: coords,  // check the order
      mood: 'some mood',
    };

    this.userService.addUser(user).subscribe(() => {console.log('??')});
  }

  private getGeolocation() {
    const onSuccess = (position) => {
      const {latitude, longitude} = position.coords;
      return `${latitude}, ${longitude}`;
    };
    const onError = (error) =>
        console.log('unble to retrive', error);  // handle errors

    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
          (position) => resolve(onSuccess(position)),
          (error) => reject(onError(error)));
    })
  }
}
