import { TestBed } from '@angular/core/testing';

import { Misinformation } from './misinformation';

describe('Misinformation', () => {
  let service: Misinformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Misinformation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
