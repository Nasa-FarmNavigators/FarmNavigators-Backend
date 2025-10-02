import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    required: false,
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+244923456789',
    required: false,
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    required: false,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsOptional()
  password?: string;
}
