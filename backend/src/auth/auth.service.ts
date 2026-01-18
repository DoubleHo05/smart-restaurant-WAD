import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || user.is_deleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password exists (not Google user)
    if (!user.password_hash) {
      throw new UnauthorizedException('Please login with Google');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.user_roles.map((ur) => ur.role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        roles: user.user_roles.map((ur) => ur.role.name),
        email_verified: user.email_verified,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    // Only check if user exists AND is not deleted
    if (existingUser && !existingUser.is_deleted) {
      // Check if this is a Google account
      if (existingUser.auth_provider === 'google') {
        throw new ConflictException(
          'This email is already registered with Google. Please login with Google instead.',
        );
      }
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Get customer role
    const customerRole = await this.prisma.role.findUnique({
      where: { name: 'customer' },
    });

    if (!customerRole) {
      throw new BadRequestException('Customer role not found');
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Token expires in 24 hours

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password_hash: hashedPassword,
        full_name: registerDto.full_name,
        phone: registerDto.phone,
        email_verified: false,
        email_verification_token: verificationToken,
        email_verification_token_expires_at: tokenExpiration,
        auth_provider: 'local',
        user_roles: {
          create: {
            role_id: customerRole.id,
          },
        },
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
        user.full_name,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        email_verified: user.email_verified,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      roles: user.user_roles.map((ur) => ur.role.name),
      email_verified: user.email_verified,
      auth_provider: user.auth_provider,
    };
  }

  async verifyEmail(token: string) {
    console.log('Verifying token:', token);

    // First, check if this token belongs to an already verified user
    const alreadyVerifiedUser = await this.prisma.user.findFirst({
      where: {
        email_verification_token: null,
        email_verified: true,
      },
    });

    // Try to find user with valid token
    const user = await this.prisma.user.findFirst({
      where: {
        email_verification_token: token,
        email_verification_token_expires_at: {
          gt: new Date(),
        },
      },
    });

    console.log('User found:', user ? user.email : 'null');

    if (!user) {
      // Check if the user was already verified (token was cleared)
      const verifiedUser = await this.prisma.user.findFirst({
        where: {
          email_verified: true,
        },
        orderBy: {
          updated_at: 'desc',
        },
        take: 1,
      });

      // If we have a recently verified user, return success instead of error
      if (verifiedUser && verifiedUser.email_verified) {
        return {
          message: 'Email verified successfully. You can now login.',
        };
      }

      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_token_expires_at: null,
        status: 'active',
      },
    });

    return {
      message: 'Email verified successfully. You can now login.',
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.email_verified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email_verification_token: verificationToken,
        email_verification_token_expires_at: tokenExpiration,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.full_name,
    );

    return {
      message: 'Verification email sent successfully',
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('No user from Google');
    }

    const { email, googleId, firstName, lastName } = req.user;

    // Check if user exists
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { google_id: googleId }],
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      // Create new user with Google
      const customerRole = await this.prisma.role.findUnique({
        where: { name: 'customer' },
      });

      if (!customerRole) {
        throw new BadRequestException('Customer role not found');
      }

      user = await this.prisma.user.create({
        data: {
          email,
          google_id: googleId,
          full_name: `${firstName} ${lastName}`,
          email_verified: true, // Google accounts are pre-verified
          auth_provider: 'google',
          status: 'active',
          user_roles: {
            create: {
              role_id: customerRole.id,
            },
          },
        },
        include: {
          user_roles: {
            include: {
              role: true,
            },
          },
        },
      });
    } else {
      // User exists - check if it's a local account
      if (user.auth_provider === 'local') {
        throw new ConflictException(
          'This email is already registered with password login. Please login with your password instead.',
        );
      }

      // If it's already a Google account, just proceed with login
      // No need to update anything
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.user_roles.map((ur) => ur.role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        roles: user.user_roles.map((ur) => ur.role.name),
        email_verified: user.email_verified,
        auth_provider: user.auth_provider,
      },
    };
  }
}
