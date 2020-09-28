import {
  MaxLength,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Phone } from '../../user/phone.entity';

/**
 * Signup dto
 */
export class SignupDto {
  /**
   * user name
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  /**
   * user email
   */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  readonly email: string;

  /**
   * user min 6 char long password
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  /**
   * user phones
   */
  @IsArray()
  @IsOptional()
  readonly phones?: Pick<Phone, 'ddd' | 'value'>[];
}
