import { Test, TestingModule } from '@nestjs/testing';
import { QrTokenService } from './qr-token.service';

describe('QrTokenService', () => {
  let service: QrTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrTokenService],
    }).compile();

    service = module.get<QrTokenService>(QrTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
