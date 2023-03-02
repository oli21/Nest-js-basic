import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}
