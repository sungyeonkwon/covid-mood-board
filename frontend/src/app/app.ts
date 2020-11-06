import {DOCUMENT, ViewportScroller} from '@angular/common';
import {Component, Inject, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {fromEvent, ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BREAKPOINT, StyleService} from 'src/shared/style_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnDestroy {
  hideLogo = false;
  scrollHide = false;
  currentUrlPath = '';
  breakpoint = BREAKPOINT;
  private readonly destroy$ = new ReplaySubject<void>(1);

  constructor(
      @Inject(DOCUMENT) private readonly document: Document,
      private readonly router: Router,
      readonly styleService: StyleService,
      private readonly viewportScroller: ViewportScroller,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.scrollHide = false;
        // Ensure the view to start from top in a new route.
        this.viewportScroller.scrollToPosition([0, 0]);

        const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
        this.currentUrlPath = event.url.slice(1).split(urlDelimitators)[0];
      }
    });

    this.addScrollListener();
  }

  private addScrollListener() {
    fromEvent(this.document, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.scrollHide = this.document.documentElement.scrollTop >= 70;
        })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
