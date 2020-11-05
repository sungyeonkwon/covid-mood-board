import {NgModule} from '@angular/core';
import {DialogComponent} from './dialog';

import {InfoComponent} from './info';

@NgModule({
  declarations: [
    InfoComponent,
    DialogComponent,
  ],
  imports: [],
  providers: [],
  exports: [
    InfoComponent,
    DialogComponent,
  ]
})
export class SharedModule {
}
