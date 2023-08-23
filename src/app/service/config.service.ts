import {Injectable} from '@angular/core';
import {Navigation} from "../interface/navigation";
import {UserColumn} from "../interface/user-column";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  assetUrl: string = 'http://localhost:8000';
  apiUrl: string = 'http://localhost:8000/api/v1/';

  navigation: Navigation[] = [
    {label: 'Home', href: '', role: 1},
    {label: 'Users', href: '/users', role: 2},
  ];

  userColumns: UserColumn[] = [
    {key: 'id', label: '#'},
    {key: 'first_name', label: 'First name'},
    {key: 'last_name', label: 'Last name'},
    {key: 'email', label: 'Email'},
    {key: 'role', label: 'Role'},
  ];

  constructor() {
  }
}
