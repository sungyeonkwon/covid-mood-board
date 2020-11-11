import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

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
    RouterModule,
  ],
  providers: [],
  exports: [
    MapViewComponent,
    ListViewComponent,
  ]
})
export class ViewModule {
}
