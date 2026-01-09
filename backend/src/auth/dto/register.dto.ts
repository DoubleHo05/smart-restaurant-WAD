import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'Password must contain uppercase, lowercase, and number' }
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
