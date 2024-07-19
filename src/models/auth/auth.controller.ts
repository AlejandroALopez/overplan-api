import {
  Get,
  Body,
  Controller,
  Request,
  UseGuards,
  Post,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SkipAuth } from './constants';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @SkipAuth()
  @Post('login')
  async login(@Body() userBody: any, @Res() res) {
    const { email, password } = userBody;

    try {
      const { access_token, refresh_token, userData } =
        await this.authService.login(email, password);

      const redirectUrl = new URL('http://localhost:3000'); // Client URL
      redirectUrl.searchParams.append('token', access_token);
      redirectUrl.searchParams.append('refreshToken', refresh_token);
      redirectUrl.searchParams.append('userData', JSON.stringify(userData));

      return res.json({ access_token, refresh_token, redirectUrl: redirectUrl.toString() });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() body: any, @Res() res: Response) {
    const { email, password, firstName, lastName } = body;

    // Check if the email already exists
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    try {
      const { access_token, refresh_token, userData } =
        await this.authService.register(email, password, firstName, lastName);
      
      const redirectUrl = new URL('http://localhost:3000'); // Client URL
      redirectUrl.searchParams.append('token', access_token);
      redirectUrl.searchParams.append('refreshToken', refresh_token);
      redirectUrl.searchParams.append('userData', JSON.stringify(userData));

      return res.json({ access_token, refresh_token, redirectUrl: redirectUrl.toString() });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  @SkipAuth()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
      try{
        await this.authService.sendPasswordResetLink(forgotPasswordDto.email);
      } catch(error) {
        throw new BadRequestException(error.message);
      }
  }

  @SkipAuth()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.pass);
  }
}
