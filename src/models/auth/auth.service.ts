import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
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

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const userData = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      activePlanId: user.activePlanId,
      tier: user.tier,
      tokens: user.tokens,
    };

    return { access_token, refresh_token, userData };
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
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const userData = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      activePlanId: user.activePlanId,
      tier: user.tier,
      tokens: user.tokens,
    };

    return { access_token, refresh_token, userData };
  }

  // Create or login user, returns object with user data and jwt tokens
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

    const jwtPayload = { username: userFromDb.email, sub: userFromDb._id };
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

    const userData = {
      userId: userFromDb._id,
      email: userFromDb.email,
      firstName: userFromDb.firstName,
      lastName: userFromDb.lastName,
      activePlanId: userFromDb.activePlanId,
      tier: userFromDb.tier,
      tokens: userFromDb.tokens,
    };

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      userData,
    };
  }

  // Returns: New access token from refresh token
  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const jwtPayload = { username: decoded.username, sub: decoded.sub };
      const newAccessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: '15m',
      });
      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async sendPasswordResetLink(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '1h' },
    );
    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const { userId } = this.jwtService.verify(token);
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.usersService.update(user._id, { password: hashedPassword });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
