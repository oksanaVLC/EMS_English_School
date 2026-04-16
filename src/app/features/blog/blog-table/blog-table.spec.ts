import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTable } from './blog-table';

describe('BlogTable', () => {
  let component: BlogTable;
  let fixture: ComponentFixture<BlogTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
