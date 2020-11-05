import {ViewportScroller} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BREAKPOINT, StyleService} from 'src/shared/style_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  hideLogo = false;
  currentUrlPath = '';
  breakpoint = BREAKPOINT;

  constructor(
      private readonly router: Router,
      readonly styleService: StyleService,
      private readonly viewportScroller: ViewportScroller,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Ensure the view to start from top in a new route.
        this.viewportScroller.scrollToPosition([0, 0]);

        const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
        this.currentUrlPath = event.url.slice(1).split(urlDelimitators)[0];
      }
    });
  }
}
