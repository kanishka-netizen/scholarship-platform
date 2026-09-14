import { ApplicationsController } from './applications.controller.js';
import { ApplicationsService } from './applications.service.js';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  beforeEach(async () => {
    controller = new ApplicationsController({} as ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
