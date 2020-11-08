import {Component} from '@angular/core';

const socialText =
    'Share your mood during Covid-19 pandemic — https://covid-mood.world/';
@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss']
})
export class InfoComponent {
  readonly encodedUri = encodeURI(socialText);
}
