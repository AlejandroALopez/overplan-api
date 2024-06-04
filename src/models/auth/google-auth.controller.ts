import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SkipAuth } from './constants';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('Req: ', req);
  }

  @SkipAuth()
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { refresh_token, access_token, userData } = req.user;
    const redirectUrl = new URL('http://localhost:3000');

    redirectUrl.searchParams.append('token', access_token);
    redirectUrl.searchParams.append('refreshToken', refresh_token);
    redirectUrl.searchParams.append('userData', JSON.stringify(userData));
    res.redirect(redirectUrl.toString());
  }
}
