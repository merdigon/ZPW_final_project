import { TestBed, inject } from '@angular/core/testing';

import { SportShopService } from './sport-shop.service';

describe('SportShopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SportShopService]
    });
  });

  it('should be created', inject([SportShopService], (service: SportShopService) => {
    expect(service).toBeTruthy();
  }));
});
