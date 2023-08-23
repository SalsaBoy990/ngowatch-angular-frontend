import { Component } from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../../model/user";
import {ConfigService} from "../../service/config.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-base',
  template: `

  `
})
export class BaseComponent {
  userSubscription: Subscription;
  user: User | null = null;
  assetUrl: string = '';

  constructor(
    protected config: ConfigService,
    protected auth: AuthService,
  ) {
    this.userSubscription = this.auth.currentUserSubject.subscribe(user => this.user = user);
    this.assetUrl = this.config.assetUrl;
  }

  ngOnInit(): void {
    this.userSubscription = this.auth.currentUserSubject.subscribe(
      user => this.user = user
    );

    if (this.user === null) {
      this.user = JSON.parse(localStorage.getItem(this.auth.storageName) || '{}');
      if (this.isUserObjectEmpty(this.user)) {
        this.user = null;
      }
    }

  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }


  isUserObjectEmpty(obj: User|null) {
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
