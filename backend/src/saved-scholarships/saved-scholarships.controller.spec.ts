import { SavedScholarshipsController } from './saved-scholarships.controller.js';
import { SavedScholarshipsService } from './saved-scholarships.service.js';

describe('SavedScholarshipsController', () => {
  let controller: SavedScholarshipsController;

  beforeEach(async () => {
    controller = new SavedScholarshipsController({} as SavedScholarshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
