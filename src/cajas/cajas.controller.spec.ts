import { Test, TestingModule } from '@nestjs/testing';
import { CajasController } from './cajas.controller';

describe('CajasController', () => {
  let controller: CajasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CajasController],
    }).compile();

    controller = module.get<CajasController>(CajasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
