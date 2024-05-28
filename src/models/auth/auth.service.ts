import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const user = await this.usersService.createUser(
      email,
      password,
      firstName,
      lastName,
    );
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthLogin(user: any) {
    let userFromDb = await this.usersService.findOneByEmail(user.email);

    if (!userFromDb) {
      userFromDb = await this.usersService.createSSOUser(
        user.email,
        user.firstName,
        user.lastName,
        user.provider,
      );
    }

    const jwt_payload = { username: userFromDb.email, sub: userFromDb._id };

    const userData = {
      userId: userFromDb._id,
      email: userFromDb.email,
      firstName: userFromDb.firstName,
      lastName: userFromDb.lastName,
      // Any other user data for redux
    };

    return {
      access_token: this.jwtService.sign(jwt_payload),
      userData,
    };
  }
}
