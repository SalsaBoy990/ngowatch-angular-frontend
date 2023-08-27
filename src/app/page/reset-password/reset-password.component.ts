import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {NgForm} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  serverError: string = '';
  successNotification: string = '';

  user = {
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
  };
  validationErrors: any = {};

  constructor(
    private auth: AuthService,
    private router: Router,
    private ar: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.ar.queryParams.subscribe(params => {
      this.user.token = params['token'];
      this.user.email = params['email'];
      console.log(params);
    });


  }


  onSaveNewPassword(ngForm: NgForm): void {
    console.log(ngForm);
    lastValueFrom(this.auth.saveNewPassword(ngForm.value)).then(
      response => {
        if (response) {
          console.log(response)
          this.successNotification = response.message;
          this.router.navigate(
            ['login'],
            { queryParams: { notification : this.successNotification, alertType: 'success'}}
          )
            .then(r => console.log(r));
        }
        console.log(response);
      },
      err => {
        console.log(err);
        this.successNotification = '';
        this.validationErrors = err.error.message;
        this.serverError = err.error.message;

        const to = setTimeout(() => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    )
  }
}
