import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {ListViewComponent} from './list-view';
import {MapViewComponent} from './map-view';

@NgModule({
  declarations: [
    MapViewComponent,
    ListViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  exports: [
    MapViewComponent,
    ListViewComponent,
  ]
})
export class ViewModule {
}
