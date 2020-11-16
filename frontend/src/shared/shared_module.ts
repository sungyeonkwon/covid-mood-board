import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {InfoComponent} from './info';

@NgModule({
  declarations: [
    InfoComponent,
  ],
  imports: [
    RouterModule,
  ],
  providers: [],
  exports: [
    InfoComponent,
  ]
})
export class SharedModule {
}
