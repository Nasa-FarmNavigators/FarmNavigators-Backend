import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import * as AfricasTalking from 'africastalking';
import {
  UssdRequestDto,
  UssdResponseDto,
  PushMessageDto,
  PushMessageResponseDto,
  UssdLogDto,
} from './dto/ussd.dto';

@Injectable()
export class UssdService {
  private readonly logger = new Logger(UssdService.name);
  private africasTalking: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Verificar se as variáveis de ambiente estão configuradas
    const username = this.configService.get<string>('AT_USERNAME');
    const apiKey = this.configService.get<string>('AT_API_KEY');

    if (!username || !apiKey || apiKey === 'your_sandbox_api_key_here') {
      this.logger.warn(
        "Africa's Talking credentials not properly configured. Please set AT_USERNAME and AT_API_KEY in your .env file.",
      );
      this.logger.warn(
        'USSD functionality will be limited until proper credentials are provided.',
      );
      return;
    }

    try {
      // Inicializar Africa's Talking
      this.africasTalking = AfricasTalking({
        apiKey,
        username,
      });
      this.logger.log("Africa's Talking service initialized successfully");
    } catch (error) {
      this.logger.error(
        "Failed to initialize Africa's Talking service:",
        error,
      );
    }
  }

  async handleUssdRequest(request: UssdRequestDto): Promise<UssdResponseDto> {
    const { sessionId, serviceCode, phoneNumber, text } = request;

    try {
      // Log da requisição USSD
      await this.logUssdSession(phoneNumber, text, 'RECEIVED');

      // Lógica simples de resposta USSD
      let response = '';

      if (text === '') {
        // Primeira interação - menu principal
        response = 'END Bem-vindo ao Farm Navigators!\n\n';
        response += 'Serviço de informações agrícolas para Angola.\n';
        response +=
          'Para mais informações, contacte-nos através da nossa aplicação móvel.';
      } else {
        // Qualquer outra entrada - resposta padrão
        response = 'END Obrigado por usar o Farm Navigators!\n\n';
        response +=
          'Para acesso completo aos nossos serviços de agricultura inteligente,\n';
        response += 'baixe a nossa aplicação móvel.';
      }

      // Log da resposta
      await this.logUssdSession(phoneNumber, response, 'SENT');

      this.logger.log(
        `USSD Response sent to ${phoneNumber}: ${response.substring(0, 50)}...`,
      );

      return { response };
    } catch (error) {
      this.logger.error(
        `Error handling USSD request from ${phoneNumber}:`,
        error,
      );

      // Log do erro
      await this.logUssdSession(
        phoneNumber,
        `ERROR: ${error.message}`,
        'ERROR',
      );

      return {
        response: 'END Erro temporário no serviço. Tente novamente mais tarde.',
      };
    }
  }

  async sendPushMessage(
    pushRequest: PushMessageDto,
  ): Promise<PushMessageResponseDto> {
    const { phoneNumber, message } = pushRequest;

    // Verificar se o Africa's Talking está inicializado
    if (!this.africasTalking) {
      this.logger.warn(
        "Africa's Talking service not initialized. Cannot send push message.",
      );
      return {
        success: false,
        message:
          "Serviço de SMS não configurado. Verifique as credenciais do Africa's Talking.",
        result: null,
      };
    }

    try {
      const sms = this.africasTalking.SMS;

      const options = {
        to: phoneNumber,
        message: `Farm Navigators: ${message}`,
        from: this.configService.get<string>('AT_SERVICE_CODE', 'FarmNav'),
      };

      const result = await sms.send(options);

      this.logger.log(
        `Push message sent to ${phoneNumber}: ${message.substring(0, 50)}...`,
      );

      // Log da mensagem push
      await this.logUssdSession(phoneNumber, message, 'PUSH_SENT');

      return {
        success: true,
        result,
        message: 'Mensagem enviada com sucesso',
      };
    } catch (error) {
      this.logger.error(`Error sending push message to ${phoneNumber}:`, error);

      // Log do erro
      await this.logUssdSession(
        phoneNumber,
        `PUSH_ERROR: ${error.message}`,
        'ERROR',
      );

      return {
        success: false,
        error: error.message,
        message: 'Erro ao enviar mensagem',
      };
    }
  }

  private async logUssdSession(
    phone: string,
    request: string,
    status: string,
  ): Promise<void> {
    try {
      await this.prisma.uSSDLog.create({
        data: {
          phone,
          request,
          response: request, // Para simplificar, usamos o mesmo campo
          status,
        },
      });
    } catch (error) {
      this.logger.error('Error logging USSD session:', error);
    }
  }

  async getUssdLogs(limit: number = 100): Promise<UssdLogDto[]> {
    try {
      return await this.prisma.uSSDLog.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error('Error fetching USSD logs:', error);
      throw error;
    }
  }

  async getUssdLogsByPhone(
    phone: string,
    limit: number = 50,
  ): Promise<UssdLogDto[]> {
    try {
      return await this.prisma.uSSDLog.findMany({
        where: { phone },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching USSD logs for ${phone}:`, error);
      throw error;
    }
  }
}
