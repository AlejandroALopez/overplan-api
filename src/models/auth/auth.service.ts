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
}
