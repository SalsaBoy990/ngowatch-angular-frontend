import { Component } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };
  serverError: string = '';
  notVerifiedMessage: string = '';
  validationErrors: any = {};

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  onRegister(ngForm: NgForm): void {
    console.log(ngForm);
    lastValueFrom(this.auth.register(ngForm.value)).then(
      registerResponse => {
        if (!(registerResponse) || registerResponse.success) {
          // Need to pass query param to login route to notify user about the email verification link sent to their mailboxes
          this.notVerifiedMessage = 'Check your email inbox for the email verification link!';
          this.router.navigate(['login'], { queryParams: { notVerifiedMessage : this.notVerifiedMessage}}).then(r => console.log(r));
        }
      },
      err => {
        this.serverError = err.message;
        this.validationErrors = err.error.errors;
        console.log(err.error.errors)
        const to = setTimeout( () => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    )
  }
}
