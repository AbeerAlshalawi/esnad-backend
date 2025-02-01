import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatsService.create(createChatDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.chatsService.findAllByUser(+userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.chatsService.remove(+id);
  }
}
