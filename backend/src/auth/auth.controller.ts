import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    // JWT is stateless, just return success
    return { message: 'Logged out successfully' };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const result = await this.authService.googleLogin(req);

      // Redirect to frontend with token
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${result.access_token}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // Redirect to frontend with error
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const errorMessage = encodeURIComponent(
        error.message || 'Google login failed',
      );
      const redirectUrl = `${frontendUrl}/auth/google/callback?error=${errorMessage}`;

      return res.redirect(redirectUrl);
    }
  }
}
