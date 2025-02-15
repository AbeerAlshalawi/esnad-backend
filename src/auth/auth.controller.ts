import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { Public } from './decorators/public.decorator';
import { Get } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    if (!registerBody.email || !registerBody.password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.register(registerBody);
  }

  @UseGuards(JwtGuard)
  @Get('validate')
  validateToken(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'Invalid authorization header',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = authHeader.split(' ')[1];

    return this.authService.validateToken(token);
  }
}
