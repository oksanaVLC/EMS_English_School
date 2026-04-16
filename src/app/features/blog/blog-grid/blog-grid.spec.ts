import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogGrid } from './blog-grid';

describe('BlogGrid', () => {
  let component: BlogGrid;
  let fixture: ComponentFixture<BlogGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
