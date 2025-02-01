import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto, userId: number) {
    const { title } = createChatDto;

    if (!title) {
      throw new HttpException(
        'Title and body are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const chat = new Chat();
    chat.title = title;
    chat.user = user;
    return await this.chatsRepository.save(chat);
  }

  async findAllByUser(userId: number) {
    return await this.chatsRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id },
      relations: ['messages'],
    });

    if (!chat) {
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }

    return chat;
  }

  async remove(id: number) {
    const result = await this.chatsRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }
  }
}
