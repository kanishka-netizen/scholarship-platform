import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipsService } from './scholarships.service.js';

describe('ScholarshipsController', () => {
  let controller: ScholarshipsController;

  beforeEach(async () => {
    controller = new ScholarshipsController({} as ScholarshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
