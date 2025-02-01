import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
