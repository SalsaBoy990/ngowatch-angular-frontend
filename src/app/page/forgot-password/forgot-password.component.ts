import { Component } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {NgForm} from "@angular/forms";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  serverError: string = '';
  successNotification: string = '';

  constructor(
    private auth: AuthService,
  ) {
  }


  onSendPasswordResetLink(ngForm: NgForm): void {
    console.log(ngForm);
    lastValueFrom(this.auth.sendPasswordResetLink(ngForm.value)).then(
      response => {
        if (response) {
          this.successNotification = response.message;
        }
        console.log(response);
      },
      err => {
        console.log(err);
        this.successNotification = '';
        this.serverError = err.error.message;

        const to = setTimeout(() => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    )
  }
}
