import {
  Get,
  Body,
  Controller,
  Request,
  UseGuards,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SkipAuth } from './constants';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @SkipAuth()
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userBody: any) {
    const { email, password } = userBody;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() body: any) {
    const { email, password, firstName, lastName } = body;
    // TODO: Error handling if email already exists
    const token = await this.authService.register(
      email,
      password,
      firstName,
      lastName,
    );
    // const user = await this.usersService.createUser(
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    // );
    // const userDto = new UserDto(user);
    // return { userId: userDto._id, email: userDto.email };

    return token;
  }

  @Post('sso')
  async ssoLogin(@Body() profile: any) {
    const { email, firstName, lastName, provider } = profile;
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.createSSOUser(
        email,
        firstName,
        lastName,
        provider,
      );
    }

    const userDto = new UserDto(user);
    // You can return a JWT or another token if needed
    return { userId: userDto._id, email: userDto.email };
  }

  @SkipAuth()
  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
