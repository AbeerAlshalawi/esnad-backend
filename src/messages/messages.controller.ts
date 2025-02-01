import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtGuard)
  @Post(':chatId')
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
    @Param('chatId') chatId?: number,
  ) {
    return this.messagesService.create(createMessageDto, req.user.id, chatId);
  }

  @UseGuards(JwtGuard)
  @Get(':chatId')
  async findChatMessages(@Param('chatId') chatId: number) {
    return this.messagesService.findChatMessages(chatId);
  }
}
