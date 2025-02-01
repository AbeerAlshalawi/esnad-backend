import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    userId: number,
    chatId?: number,
  ) {
    // eslint-disable-next-line prefer-const
    let { content } = createMessageDto;

    let chatHistory = chatId ? await this.findChatMessages(chatId) : [];
    console.log(chatHistory);

    chatHistory = [];

    const { answer, chatName } = await this.getAIResponse(
      content,
      chatHistory,
      !chatId,
    );

    if (chatName) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      let chat = new Chat();
      chat.title = chatName;
      chat.user = user;
      chat = await this.chatRepository.save(chat);
      chatId = chat.id;
    }

    const userMessage = new Message();
    userMessage.content = createMessageDto.content;
    userMessage.isBot = false;
    userMessage.chat = { id: chatId } as Chat;
    await this.messageRepository.save(userMessage);

    const botMessage = new Message();
    botMessage.content = answer;
    botMessage.isBot = true;
    botMessage.chat = { id: chatId } as Chat;
    await this.messageRepository.save(botMessage);

    return {
      chatId,
      answer,
      chatName,
    };
  }

  private async getAIResponse(
    question: string,
    chat_history: any[],
    isFirstMessage: boolean,
  ) {
    try {
      console.log({ question, chat_history, return_chat_name: isFirstMessage });
      const response = await this.httpService
        .post('https://9444-95-218-193-12.ngrok-free.app/query', {
          question,
          chat_history,
          return_chat_name: isFirstMessage,
        })
        .toPromise();

      return {
        answer: response.data.answer,
        chatName: response.data.chat_name,
      };
    } catch (error) {
      console.log(error);
      return { error, answer: 'Error getting response from AI' };
    }
  }

  async findChatMessages(chatId: number) {
    return await this.messageRepository.find({
      where: { chat: { id: chatId } },
      // order: { id: 'DESC' },
    });
  }
}
