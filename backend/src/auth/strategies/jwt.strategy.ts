import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('🔐 [JwtStrategy] Validating JWT token:', {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    console.log('🔍 [JwtStrategy] User lookup result:', {
      found: !!user,
      userId: user?.id,
      status: user?.status,
      roles: user?.user_roles?.map((ur) => ur.role.name),
    });

    if (!user || user.status !== 'active') {
      console.error('❌ [JwtStrategy] User validation failed:', {
        userExists: !!user,
        userStatus: user?.status,
      });
      throw new UnauthorizedException('User not found or inactive');
    }

    const result = {
      userId: user.id,
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      roles: user.user_roles.map((ur) => ur.role.name),
    };

    console.log('✅ [JwtStrategy] Validation successful:', {
      userId: result.userId,
      email: result.email,
      roles: result.roles,
    });

    return result;
  }
}
