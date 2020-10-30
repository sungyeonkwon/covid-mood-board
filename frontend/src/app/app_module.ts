import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app';
import {AppRoutingModule} from './app_routing_module';
import {ListViewComponent} from './list-view';
import {MapViewComponent} from './map-view';
import {SubmitComponent} from './submit';

@NgModule({
  declarations: [
    AppComponent,
    SubmitComponent,
    MapViewComponent,
    ListViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
