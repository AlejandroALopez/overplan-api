import { User } from '../schemas/user.schema';

export class UserDto {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider?: string;

  constructor(user: User) {
    this._id = user._id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.provider = user.provider;
  }
}
