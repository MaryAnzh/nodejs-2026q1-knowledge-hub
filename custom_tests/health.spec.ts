import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app-service';
import { HELLO } from '../src/constants';

describe('HealthController (unit)', () => {
    let controller: AppController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile();

        controller = module.get<AppController>(AppController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return health message', () => {
        const result = controller.getRoot();
        expect(result).toBe(HELLO);
    });
});