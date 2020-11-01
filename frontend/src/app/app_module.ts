import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../shared/shared_module';
import {SubmitModule} from '../submit/submit_module';

import {ViewModule} from '../view/view_module';

import {AppComponent} from './app';
import {AppRoutingModule} from './app_routing_module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ViewModule,
    SubmitModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
