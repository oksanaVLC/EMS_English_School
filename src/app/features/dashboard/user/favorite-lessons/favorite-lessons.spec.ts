import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteLessons } from './favorite-lessons';

describe('FavoriteLessons', () => {
  let component: FavoriteLessons;
  let fixture: ComponentFixture<FavoriteLessons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteLessons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteLessons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
