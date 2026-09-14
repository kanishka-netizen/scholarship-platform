import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    controller = new UsersController({} as UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
