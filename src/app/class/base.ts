import {User} from "../model/user";

export class Base {

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

