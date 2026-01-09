import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        status: 'active',
      },
    });

    // Find customer role
    const customerRole = await this.prisma.roles.findUnique({
      where: { name: 'customer' },
    });

    if (customerRole) {
      // Assign customer role to user
      await this.prisma.user_roles.create({
        data: {
          user_id: user.id,
          role_id: customerRole.id,
        },
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: 'customer' };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: 'customer',
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email with roles
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active (status = 'active' instead of is_active)
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's first role (typically users have one primary role)
    const userRole = user.user_roles[0]?.roles?.name || 'customer';

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: userRole };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: userRole,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    const userRole = user.user_roles[0]?.roles?.name || 'customer';

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: userRole,
    };
  }
}
