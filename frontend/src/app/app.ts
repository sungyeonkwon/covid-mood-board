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
  breakpoint = BREAKPOINT;
  constructor(
      private readonly router: Router,
      private readonly styleService: StyleService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
        let currentUrlPath = event.url.slice(1).split(urlDelimitators)[0];
        this.hideLogo = currentUrlPath === 'submit' &&
            this.styleService.innerWidth >= BREAKPOINT;
      }
    });
  }
}
