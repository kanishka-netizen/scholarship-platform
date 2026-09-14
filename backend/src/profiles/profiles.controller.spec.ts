import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    controller = new ProfilesController({} as ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
