import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UssdService } from './ussd.service';
import {
  UssdRequestDto,
  UssdResponseDto,
  PushMessageDto,
  PushMessageResponseDto,
  UssdLogDto,
} from './dto/ussd.dto';

@ApiTags('USSD')
@Controller('ussd')
export class UssdController {
  private readonly logger = new Logger(UssdController.name);

  constructor(private readonly ussdService: UssdService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Handle USSD requests from Africa's Talking",
    description:
      "Webhook endpoint to receive and respond to USSD messages from Africa's Talking gateway",
  })
  @ApiBody({
    description: "USSD request data from Africa's Talking",
    schema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Unique session identifier for the USSD session',
          example: 'ATUid_123456789',
        },
        serviceCode: {
          type: 'string',
          description: 'USSD service code dialed by user',
          example: '*123#',
        },
        phoneNumber: {
          type: 'string',
          description: 'Phone number of the user (international format)',
          example: '+244900123456',
        },
        text: {
          type: 'string',
          description: 'Text sent by user (empty for initial request)',
          example: '1*2',
        },
      },
      required: ['sessionId', 'serviceCode', 'phoneNumber', 'text'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'USSD response to be sent back to user',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'string',
          description: 'USSD response message (must start with END or CON)',
          example: 'END Bem-vindo ao Farm Navigators!',
        },
      },
    },
  })
  async handleUssd(@Body() request: UssdRequestDto): Promise<UssdResponseDto> {
    this.logger.log(
      `USSD request received from ${request.phoneNumber}: ${request.text}`,
    );

    return await this.ussdService.handleUssdRequest(request);
  }

  @Post('push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send push SMS message via Africa's Talking",
    description:
      "Send SMS push notifications to users via Africa's Talking SMS gateway",
  })
  @ApiBody({
    description: 'Push message data',
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: 'Phone number to send message to (international format)',
          example: '+244900123456',
        },
        message: {
          type: 'string',
          description: 'Message content to send',
          example: 'Nova recomendação agrícola disponível para a sua fazenda!',
        },
      },
      required: ['phoneNumber', 'message'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Push message send result',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Whether the message was sent successfully',
        },
        message: {
          type: 'string',
          description: 'Result message',
        },
        result: {
          type: 'object',
          description: "Africa's Talking API response (if successful)",
        },
        error: {
          type: 'string',
          description: 'Error message (if failed)',
        },
      },
    },
  })
  async sendPushMessage(
    @Body() pushRequest: PushMessageDto,
  ): Promise<PushMessageResponseDto> {
    this.logger.log(
      `Push message request for ${pushRequest.phoneNumber}: ${pushRequest.message.substring(0, 50)}...`,
    );

    return await this.ussdService.sendPushMessage(pushRequest);
  }

  @Get('logs')
  @ApiOperation({
    summary: 'Get USSD interaction logs',
    description:
      'Retrieve recent USSD interaction logs for monitoring and debugging',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of logs to retrieve',
    example: 100,
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'Filter logs by phone number',
    example: '+244900123456',
  })
  @ApiResponse({
    status: 200,
    description: 'USSD logs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          phone: { type: 'string' },
          request: { type: 'string' },
          response: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getUssdLogs(
    @Query('limit') limit?: number,
    @Query('phone') phone?: string,
  ): Promise<UssdLogDto[]> {
    if (phone) {
      return await this.ussdService.getUssdLogsByPhone(phone, limit || 50);
    }

    return await this.ussdService.getUssdLogs(limit || 100);
  }
}
