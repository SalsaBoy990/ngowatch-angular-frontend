import {Component} from '@angular/core';
import {ConfigService} from "../../service/config.service";
import {AuthService} from "../../service/auth.service";
import {BaseComponent} from "../../component/base/base.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent {


  constructor(
    config: ConfigService,
    auth: AuthService,
  ) {
    super(config, auth);
  }


}
