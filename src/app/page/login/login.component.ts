import { Component } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {NgForm} from "@angular/forms";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: User = new User();
  serverError: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  onLogin(ngForm: NgForm): void {
  console.log(ngForm);
    lastValueFrom(this.auth.login(ngForm.value)).then(
      userResponse => {
        if (this.auth.currentUserValue) {
          this.router.navigate(['/']).then(r => console.log(r));
        }
      },
      err => {
        this.serverError = err.message;
        const to = setTimeout( () => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    )
  }
}
