import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isBot: boolean;

  @IsNotEmpty()
  chatId: number;
}
