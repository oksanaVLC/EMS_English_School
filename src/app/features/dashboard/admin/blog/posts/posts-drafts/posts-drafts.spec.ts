import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsDrafts } from './posts-drafts';

describe('PostsDrafts', () => {
  let component: PostsDrafts;
  let fixture: ComponentFixture<PostsDrafts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsDrafts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsDrafts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
