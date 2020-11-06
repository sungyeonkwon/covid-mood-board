import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DialogComponent} from './dialog';

import {InfoComponent} from './info';

@NgModule({
  declarations: [
    InfoComponent,
    DialogComponent,
  ],
  imports: [
    RouterModule,
  ],
  providers: [],
  exports: [
    InfoComponent,
    DialogComponent,
  ]
})
export class SharedModule {
}
