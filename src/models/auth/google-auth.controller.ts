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
    const token = req.user;
    res.redirect(`http://localhost:3000?token=${token.access_token}`);
  }
}
