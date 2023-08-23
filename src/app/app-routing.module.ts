import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./page/home/home.component";
import {LoginComponent} from "./page/login/login.component";
import {UserEditComponent} from "./page/user-edit/user-edit.component";
import {UsersComponent} from "./page/users/users.component";
import {ForbiddenComponent} from "./page/forbidden/forbidden.component";
import {authGuard} from "./guard/auth.guard";
import {roleGuard} from "./guard/role.guard";
import {loggedinGuard} from "./guard/loggedin.guard";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedinGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      expectedRole: 2,
    }
  },
  {
    path: 'user/edit/:id',
    component: UserEditComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      expectedRole: 3,
    }
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  // all the other urls
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
