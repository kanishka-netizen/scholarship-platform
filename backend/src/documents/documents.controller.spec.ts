import { DocumentsController } from './documents.controller.js';
import { DocumentsService } from './documents.service.js';

describe('DocumentsController', () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    controller = new DocumentsController({} as DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
