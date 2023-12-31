import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/user";
import {NgForm} from "@angular/forms";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  serverError: string = '';
  notification: string = '';
  alertType: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // get the "email verification needed" message from route query params
    this.route.queryParams.subscribe(params => {
        this.notification = params['notification'] ?? '';
        this.alertType = params['alertType'] ?? 'danger'
        console.log(this.notification);
      }
    );
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
        this.serverError = err.error.message;

        // only resends verification link if user is not yet verified
        this.auth.resend();

        // notify user to check their email inbox
        if (this.serverError === 'Your email address is not verified.') {
          this.notification = 'Check your email inbox for the email verification link!';
        }

        const to = setTimeout(() => {
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    )
  }
}
