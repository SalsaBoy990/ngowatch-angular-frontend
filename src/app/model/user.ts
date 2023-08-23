import {Role} from "../interface/role";
import {UserDetail} from "../interface/user-detail";

export class User {
  id?: number;
  name?: string;
  email?: string;
  handle?: string;
  enable_2fa?: number;
  role?: Role;
  user_detail?: UserDetail;
  token: string | undefined;
  [key: string]: any;
}
