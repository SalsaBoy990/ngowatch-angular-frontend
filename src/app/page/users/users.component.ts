import {Component} from '@angular/core';
import {firstValueFrom, lastValueFrom, Observable} from "rxjs";
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {ConfigService} from "../../service/config.service";
import {UserColumn} from "../../interface/user-column";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  list$: Observable<User|User[]> = this.userService.get();
  columns: UserColumn[] = this.config.userColumns;

  constructor(
    private userService: UserService,
    private config: ConfigService
  ) {
  }

  update(user: User): void {
    lastValueFrom(this.userService.update(user)).then(
      userResponse => console.log(userResponse),
      err => console.error(err)
    );
  }


}
