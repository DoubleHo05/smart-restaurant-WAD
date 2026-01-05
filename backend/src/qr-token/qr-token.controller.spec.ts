import { Test, TestingModule } from '@nestjs/testing';
import { QrTokenController } from './qr-token.controller';

describe('QrTokenController', () => {
  let controller: QrTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrTokenController],
    }).compile();

    controller = module.get<QrTokenController>(QrTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
