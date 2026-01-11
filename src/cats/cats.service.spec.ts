import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatsService } from './cats.service';
import { CatEntity } from './entity/cats.entity';

describe('CatsService', () => {
    let service: CatsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CatsService,
                { provide: getRepositoryToken(CatEntity), useValue: {} },
            ],
        }).compile();

        service = module.get<CatsService>(CatsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
