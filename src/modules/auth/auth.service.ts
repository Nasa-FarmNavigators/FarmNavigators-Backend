import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // Tentar encontrar por email primeiro, depois por phone
    let user = await this.usersService.findByEmail(identifier);
    if (!user) {
      user = await this.usersService.findByPhone(identifier);
    }

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.email || loginDto.phone;
    if (!identifier) {
      throw new UnauthorizedException('Email ou telefone deve ser fornecido');
    }

    const user = await this.validateUser(identifier, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      email: user.email,
      phone: user.phone,
      sub: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7 dias em segundos
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        language: user.language,
        timezone: user.timezone,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar se o usuário já existe por email ou phone
    if (registerDto.email) {
      const existingUserByEmail = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    if (registerDto.phone) {
      const existingUserByPhone = await this.usersService.findByPhone(
        registerDto.phone,
      );
      if (existingUserByPhone) {
        throw new ConflictException('Telefone já está em uso');
      }
    }

    // Verificar se pelo menos email ou phone foi fornecido
    if (!registerDto.email && !registerDto.phone) {
      throw new ConflictException('Email ou telefone deve ser fornecido');
    }

    // Criar o novo usuário
    const user = await this.usersService.create(registerDto);

    // Fazer login automático após registro
    const payload = {
      email: user.email,
      phone: user.phone,
      sub: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7 dias em segundos
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        language: user.language,
        timezone: user.timezone,
      },
    };
  }

  async getProfile(userId: string) {
    return await this.usersService.findOne(userId);
  }

  async updateProfile(userId: string, updateData: UpdateUserDto) {
    return await this.usersService.update(userId, updateData);
  }

  async deleteProfile(userId: string) {
    return await this.usersService.remove(userId);
  }
}
