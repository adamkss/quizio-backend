import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user)
      return null;

    const isPasswordRight = await new Promise((resolve, reject) => {
      bcrypt.compare(pass, user.passwordHash, (err, res) => {
        if (res) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });

    if (isPasswordRight) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}