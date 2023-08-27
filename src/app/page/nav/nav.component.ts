import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../service/config.service";
import {Navigation} from "../../interface/navigation";
import {Subscription} from "rxjs";
import {User} from "../../model/user";
import {AuthService} from "../../service/auth.service";
import {Base} from "../../class/base";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends Base implements OnInit, OnDestroy {

  navigation: Navigation[] = this.config.navigation;
  loginStatus: boolean = false;
  userSubscription: Subscription;
  user: User | null = null;


  constructor(
    private config: ConfigService,
    private auth: AuthService,
  ) {
    super();
    this.userSubscription = this.auth.currentUserSubject.subscribe(user => this.user = user);
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


  onLogout() {
    this.auth.logout();
  }

}
