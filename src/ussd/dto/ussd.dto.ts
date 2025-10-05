import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UssdRequestDto {
  @ApiProperty({
    description: 'Unique session identifier for the USSD session',
    example: 'ATUid_123456789',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'USSD service code dialed by user',
    example: '*123#',
  })
  @IsString()
  @IsNotEmpty()
  serviceCode: string;

  @ApiProperty({
    description: 'Phone number of the user (international format)',
    example: '+244900123456',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Text sent by user (empty for initial request)',
    example: '1*2',
    required: false,
  })
  @IsString()
  @IsOptional()
  text: string;
}

export class UssdResponseDto {
  @ApiProperty({
    description: 'USSD response message (must start with END or CON)',
    example: 'END Bem-vindo ao Farm Navigators!',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}

export class PushMessageDto {
  @ApiProperty({
    description: 'Phone number to send message to (international format)',
    example: '+244900123456',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Message content to send',
    example: 'Nova recomendação agrícola disponível para a sua fazenda!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class PushMessageResponseDto {
  @ApiProperty({
    description: 'Whether the message was sent successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Result message',
    example: 'Mensagem enviada com sucesso',
  })
  message: string;

  @ApiProperty({
    description: "Africa's Talking API response (if successful)",
    required: false,
  })
  result?: any;

  @ApiProperty({
    description: 'Error message (if failed)',
    required: false,
  })
  error?: string;
}

export class UssdLogDto {
  @ApiProperty({
    description: 'Log entry ID',
    example: 'cuid_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+244900123456',
  })
  phone: string;

  @ApiProperty({
    description: 'Request content',
    example: '1*2',
  })
  request: string;

  @ApiProperty({
    description: 'Response content',
    example: 'END Obrigado por usar o Farm Navigators!',
  })
  response: string;

  @ApiProperty({
    description: 'Status of the interaction',
    example: 'SENT',
  })
  status: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;
}
