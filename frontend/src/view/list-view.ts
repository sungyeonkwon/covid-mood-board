import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {Mood} from 'src/constants/constants';
import {getPercentage} from '../shared/helpers';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.html',
  styleUrls: ['./list-view.scss']
})
export class ListViewComponent implements OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);
  getPercentage = getPercentage;

  readonly moodFilter$ = new BehaviorSubject<Mood>(Mood.UNDEFINED);
  moodRef = Mood;

  readonly users$ = (this.activatedRoute.data as Observable<any>)  // TODO: type
                        .pipe(
                            map(data => data.users), takeUntil(this.destroy$)

                        );

  readonly filteredUsers$ =
      combineLatest([this.users$, this.moodFilter$])
          .pipe(
              map(([users, mood]) => users.filter(user => {
                if (mood === 'undefined') {
                  return true;
                } else {
                  return user.mood === mood;
                }
              })),
              takeUntil(this.destroy$),
          )

  constructor(
      private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
