import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {UserService} from '../shared/user_service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.html',
  styleUrls: ['./list-view.scss']
})
export class ListViewComponent {
  users$ = this.userService.getAllUsers();

  constructor(private readonly userService: UserService) {
    this.users$.subscribe((users) => {console.log('users', users)})
  }
}
