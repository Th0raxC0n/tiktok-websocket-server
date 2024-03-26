import { Test, TestingModule } from '@nestjs/testing';
import { TiktokLiveService } from './tiktok-live.service';

describe('TiktokLiveService', () => {
  let service: TiktokLiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiktokLiveService],
    }).compile();

    service = module.get<TiktokLiveService>(TiktokLiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
