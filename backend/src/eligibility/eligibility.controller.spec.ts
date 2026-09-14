import { EligibilityController } from './eligibility.controller.js';
import { EligibilityService } from './eligibility.service.js';

describe('EligibilityController', () => {
  let controller: EligibilityController;

  beforeEach(async () => {
    controller = new EligibilityController({} as EligibilityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
