import { TestBed } from '@angular/core/testing';

import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';

describe('Breadcrumbs', () => {
  let service: Breadcrumbs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Breadcrumbs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
