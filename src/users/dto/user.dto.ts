import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
