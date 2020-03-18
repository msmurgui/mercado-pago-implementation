import { TestBed } from '@angular/core/testing';

import { MercadopagoApiService } from './mercadopago-api.service';

describe('MercadopagoApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MercadopagoApiService = TestBed.get(MercadopagoApiService);
    expect(service).toBeTruthy();
  });
});
