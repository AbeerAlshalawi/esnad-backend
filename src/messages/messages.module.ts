import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ChatsModule,
    UsersModule,
    TypeOrmModule.forFeature([Message, Chat, User]),
    HttpModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
