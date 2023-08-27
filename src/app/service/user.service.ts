import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";

import {ConfigService} from "./config.service";
import {User} from "../model/user";
import {SuccessResponse} from "../interface/response/success-response";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  entity: string = 'users';
  resendEmailUrl: string = `${this.config.apiUrl}email/resend`;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
  }


  get(id?: string | number): Observable<User | User[]> {
    let url = `${this.config.apiUrl}${this.entity}`;
    if (id) {
      url += `/${id}`;
    }
    return this.http.get<User | User[]>(url);
  }


  getLoggedInUser(token: string | undefined): Observable<User> {
    const url = `${this.config.apiUrl}user`;

    this.resendEmailVerificationLink(token);

    return this.http.get<User>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  query(queryString: string): Observable<User[]> {
    const url = `${this.config.apiUrl}${this.entity}?${queryString}`;
    return this.http.get<User[]>(url);
  }

  update(user: User): Observable<User> {
    const url = `${this.config.apiUrl}${this.entity}/${user.id}`;
    return this.http.put<User>(url, user);
  }

  resendEmailVerificationLink(token: string | undefined) {
    lastValueFrom(this.http.get<SuccessResponse>(this.resendEmailUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).then(
      response => {
        console.log(response)
      },
      err => {
        console.log(err)
      },
    );
  }


}
