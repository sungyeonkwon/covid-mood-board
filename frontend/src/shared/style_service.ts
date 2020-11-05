import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent, ReplaySubject} from 'rxjs';
import {startWith, takeUntil, throttleTime} from 'rxjs/operators';

export const BREAKPOINT = 750;

@Injectable({providedIn: 'root'})
export class StyleService {
  private readonly destroy$ = new ReplaySubject<void>(1);

  readonly resize$ = fromEvent(window, 'resize').pipe(throttleTime(50));

  private windowWidth = this.document.documentElement.clientWidth;
  private windowHeight = this.document.documentElement.clientHeight;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.resize$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.windowWidth = this.document.documentElement.clientWidth;
      this.windowHeight = this.document.documentElement.clientHeight;
    });
  }

  get innerWidth(): number {
    return this.windowWidth;
  }

  get innerHeight(): number {
    return this.windowHeight;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
