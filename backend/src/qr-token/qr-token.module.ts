import { Module } from '@nestjs/common';
import { QrTokenService } from './qr-token.service';
import { QrTokenController } from './qr-token.controller';
import { QrAccessService } from './qr-access.service';
import { QrAccessController } from './qr-access.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN') || '30d',
                },
            }),
        }),
    ],
    providers: [QrTokenService, QrAccessService],
    controllers: [QrTokenController, QrAccessController],
    exports: [QrTokenService, QrAccessService],
})
export class QrTokenModule { }
