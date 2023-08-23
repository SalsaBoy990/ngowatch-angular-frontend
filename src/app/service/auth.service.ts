import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {switchMap} from "rxjs/operators";
import {User} from "../model/user";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {LoginResponse} from "../interface/login-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl: string = `${this.config.apiUrl}login`;
  logoutUrl: string = `${this.config.apiUrl}logout`;
  currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  storageName = 'currentUser';
  lastToken: string | undefined = '';

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
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
          this.lastToken = response.result?.access_token;
          console.log(this.lastToken)
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


  isUserObjectEmpty(obj: User | null) {
    if (obj === null) {
      return false
    }

    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  }

}
