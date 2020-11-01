import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserResolver} from '../shared/user_resolver';

import {SubmitComponent} from '../submit/submit';
import {ListViewComponent} from '../view/list-view';
import {MapViewComponent} from '../view/map-view';

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
    resolve: {
      users: UserResolver,
    }
  },
  {
    path: 'map',
    pathMatch: 'full',
    component: MapViewComponent,
    resolve: {
      users: UserResolver,
    }
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
