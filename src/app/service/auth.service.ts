import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {switchMap} from "rxjs/operators";
import {User} from "../model/user";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {LoginResponse} from "../interface/response/login-response";
import {RegisterResponse} from "../interface/response/register-response";
import {RegisterRequest} from "../interface/request/register-request";
import {SuccessResponse} from "../interface/response/success-response";
import {Base} from "../class/base";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Base {

  loginUrl: string = `${this.config.apiUrl}login`;
  logoutUrl: string = `${this.config.apiUrl}logout`;
  registerUrl: string = `${this.config.apiUrl}register`;
  resendEmailUrl: string = `${this.config.apiUrl}email/resend`;
  sendPasswordResetLinkUrl: string = `${this.config.apiUrl}password/email`;
  resetPasswordUrl: string = `${this.config.apiUrl}password/reset`;

  currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  storageName = 'currentUser';
  lastToken: string | undefined = '';
  error: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {
    super();
  }


  /**
   * Get the user object from local storage (if it exists),
   * Notify subscribed components with the new user value
   */
  setUserFromLocalStorage() {
    if (!this.currentUserSubject.value) {
      const user = JSON.parse(localStorage.getItem(this.storageName) || '{}');
      if (!this.isUserObjectEmpty(user)) {
        this.currentUserSubject.next(user);
      }
    }
  }


  /**
   * Getter for the user object
   */
  get currentUserValue(): User | null {
    this.setUserFromLocalStorage();
    return this.currentUserSubject.value;
  }


  /**
   * Login user and set the value of the user subject and emit this value for the subscribers
   *
   * @param loginData
   */
  login(loginData: User): Observable<LoginResponse | User | null> {
    return this.http.post<LoginResponse>(
      this.loginUrl,
      {email: loginData.email, password: loginData['password']}
    )

      .pipe(switchMap(response => {
        if (response.result?.access_token) {

          // Need the lastToken if getLoggedInUser fails (case: when email is not yet verified)
          this.lastToken = response.result?.access_token;
          return this.userService.getLoggedInUser(this.lastToken);
        }
        return of(null);
      }))
      .pipe(
        tap(userResponse => {
          console.log(userResponse)
          if (!userResponse) {
            localStorage.removeItem(this.storageName);
            this.currentUserSubject.next(null);
          } else {

            const user: User = userResponse['result'];
            user.token = this.lastToken;

            localStorage.setItem(this.storageName, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      )
      ;
  }


  /**
   * Logs user out
   *
   */
  logout() {
    // this call invalidates the token
    this.http.post<any>(this.logoutUrl, {})
      .pipe(switchMap(response => {
        console.log(response)
        return of(null);
      }));

    // Remove user data
    localStorage.removeItem(this.storageName);
    this.currentUserSubject.next(null);

    // Navigate to login page
    this.router.navigate(['login']).then(r => console.log(r));
  }


  /**
   * Registers a user and redirects to login page after (also sends email verification link)
   *
   **/
  register(registerData: RegisterRequest): Observable<RegisterResponse | null> {
    return this.http.post<RegisterResponse>(
      this.registerUrl,
      {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.password_confirmation
      }
    )
      .pipe(switchMap(response => {
        if (response) {
          console.log(response)
          return of(response);
        }
        return of(null);
      }));
  }


  /**
   * Resends an email verification link
   *
   **/
  resend() {
    return this.http.post<any>(this.resendEmailUrl, {})
      .pipe(switchMap(response => {
        if (response) {
          console.log(response)
          return of(response);
        }
        return of(null);
      }));
  }


  /**
   * Sends password reset link to the user in email
   *
   **/
  sendPasswordResetLink(sendPasswordResetData: { email: string }) {
    return this.http.post<SuccessResponse | null>(
      this.sendPasswordResetLinkUrl,
      {email: sendPasswordResetData.email}
    )
      .pipe(switchMap(response => {
        if (response) {
          console.log(response)
          return of(response);
        }
        return of(null);
      }));
  }


  /**
   * Registers a user and redirects to login page after (also sends email verification link)
   *
   **/
  saveNewPassword(saveNewPasswordData: {
    email: string, password: string, password_confirmation: string, token: string
  }): Observable<SuccessResponse | null> {
    return this.http.post<any>(
      this.resetPasswordUrl,
      {
        token: saveNewPasswordData.token,
        email: saveNewPasswordData.email,
        password: saveNewPasswordData.password,
        password_confirmation: saveNewPasswordData.password_confirmation
      }
    )
      .pipe(switchMap(response => {
        if (response) {
          console.log(response)
          return of(response);
        }
        return of(null);
      }));
  }

}
