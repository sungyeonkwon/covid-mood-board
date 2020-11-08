import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {Mood} from 'src/constants/constants';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.html',
  styleUrls: ['./list-view.scss']
})
export class ListViewComponent implements OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);

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

  // Todo: cache this, rather than calculating all the time.
  getPercentage(users, mood: Mood) {
    const total = users.length;
    const numerator = users.filter(user => user.mood === mood).length;
    return (numerator / total * 100).toFixed(1) + '%';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
