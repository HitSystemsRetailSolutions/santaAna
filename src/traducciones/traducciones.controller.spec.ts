import { Test, TestingModule } from '@nestjs/testing';
import { TraduccionesController } from './traducciones.controller';

describe('TraduccionesController', () => {
  let controller: TraduccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraduccionesController],
    }).compile();

    controller = module.get<TraduccionesController>(TraduccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
