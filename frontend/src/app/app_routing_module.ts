import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app';
import {ListViewComponent} from './list-view';
import {MapViewComponent} from './map-view';
import {SubmitComponent} from './submit';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MapViewComponent,
  },
  {
    path: 'list',
    pathMatch: 'full',
    component: ListViewComponent,
  },
  {
    path: 'submit',
    pathMatch: 'full',
    component: SubmitComponent,
  },
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
