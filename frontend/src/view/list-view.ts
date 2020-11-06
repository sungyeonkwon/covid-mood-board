import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.html',
  styleUrls: ['./list-view.scss']
})
export class ListViewComponent implements OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);

  readonly users$ = (this.activatedRoute.data as Observable<any>)  // TODO: type
                        .pipe(
                            map(data => data.users), takeUntil(this.destroy$)

                        );

  constructor(
      private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
