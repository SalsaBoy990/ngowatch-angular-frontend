import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavComponent} from './page/nav/nav.component';
import {HomeComponent} from './page/home/home.component';
import {LoginComponent} from './page/login/login.component';
import {UsersComponent} from './page/users/users.component';
import {UserEditComponent} from './page/user-edit/user-edit.component';
import {ForbiddenComponent} from './page/forbidden/forbidden.component';
import { RegisterComponent } from './page/register/register.component';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import {TokenInterceptorService} from "./service/token-interceptor.service";
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    UserEditComponent,
    ForbiddenComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
