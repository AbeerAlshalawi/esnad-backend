import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { AccessToken } from './types/AccessToken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return { id: user.id, access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
      chats: [],
    };
    await this.userService.create(newUser);
    return this.login(newUser);
  }
}
