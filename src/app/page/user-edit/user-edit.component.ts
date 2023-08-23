import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap, take} from "rxjs/operators";

import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  user: User | null = null;
  serverError: string = '';

  constructor(
    private userService: UserService,
    private ar: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.ar.params.pipe(
      switchMap(params => this.userService.get(params['id']))
    )
      .pipe(take(1)).subscribe(
      user => {
        this.user = (user as User);
        this.user['password'] = '';
      }
    );
  }

  ngOnDestroy(): void {
  }

  onSubmit(ngForm: NgForm) {
    const user = (this.user as User);
    const putObject = Object.assign({id: user['id']}, ngForm.value);

    this.userService.update(putObject).toPromise().then(
      user => history.back(),
      err => {
        this.serverError = err.error;
        const to = setTimeout(() => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    );


  }

}
