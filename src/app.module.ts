import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';

const entitiesPath = __dirname + '/**/*.entity{.ts,.js}';

dotenv.config();
const env = process.env.NODE_ENV;

@Module({
  imports: [
    TypeOrmModule.forRoot(
      env === 'test'
        ? {
            type: 'postgres',
            host: process.env.TEST_DB_HOST,
            port: 5432,
            username: process.env.TEST_DB_USERNAME,
            password: process.env.TEST_DB_PASSWORD,
            database: process.env.TEST_DB_NAME,
            autoLoadEntities: true,
            entities: [entitiesPath],
            synchronize: false,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            entities: [entitiesPath],
            synchronize: false,
          },
    ),
    UsersModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
