import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get(':email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
