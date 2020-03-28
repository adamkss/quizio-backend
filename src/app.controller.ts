import { Controller, Request, Post, Get, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UsersService) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async registerUser(@Body() newUser) {
    const user = await this.userService.createNewUser(newUser.email, newUser.password, newUser.name || "Anonymous");
    const { passwordHash, ...newUserWithoutPassword } = user;
    return newUserWithoutPassword;
  }
}