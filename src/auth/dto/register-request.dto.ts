import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
