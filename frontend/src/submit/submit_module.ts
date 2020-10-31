import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {SubmitComponent} from './submit';

@NgModule({
  declarations: [
    SubmitComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  exports: [
    SubmitComponent,
  ]
})
export class SubmitModule {
}
