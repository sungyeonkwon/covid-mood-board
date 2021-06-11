import {DOCUMENT, ViewportScroller} from '@angular/common';
import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject, fromEvent, Observable, ReplaySubject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {BREAKPOINT, StyleService} from 'src/shared/style_service';
import {UserService} from 'src/shared/user_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnDestroy {
  haveSeenAlready = localStorage.getItem('covid-mood-board');
  hideLogo = false;
  scrollHide = false;
  currentUrlPath = '';
  breakpoint = BREAKPOINT;
  showInstruction = true;
  destroyInstruction = false;

  showWidget$ = new BehaviorSubject(true);

  private readonly destroy$ = new ReplaySubject<void>(1);

  loaded$ = this.userService.loaded$.pipe(map(loaded => loaded.toString()))
  words$ = this.userService.fetchWords();
  count$ =
      this.userService.fetchCount().pipe(map((value) => value + ' entries'));

  constructor(
      @Inject(DOCUMENT) private readonly document: Document,
      private readonly router: Router,
      readonly styleService: StyleService,
      readonly userService: UserService,
      private readonly viewportScroller: ViewportScroller,
      readonly cdr: ChangeDetectorRef,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        const isNotMap = event.url.includes('list') ||
            event.url.includes('info') || event.url.includes('submit');
        if (isNotMap) {
          this.destroyInstruction = true;
        }
        this.showWidget$.next(!isNotMap);
      }

      if (event instanceof NavigationEnd) {
        this.scrollHide = false;
        // Ensure the view to start from top in a new route.
        this.viewportScroller.scrollToPosition([0, 0]);

        const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
        this.currentUrlPath = event.url.slice(1).split(urlDelimitators)[0];
      }
    });

    setTimeout(() => {
      this.hideInstruction();
      localStorage.setItem('covid-mood-board', 'true');
    }, 3000);

    this.addScrollListener();
  }

  hideInstruction() {
    this.showInstruction = false;
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
