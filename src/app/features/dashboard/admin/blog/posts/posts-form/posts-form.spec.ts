import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsForm } from './posts-form';

describe('PostsForm', () => {
  let component: PostsForm;
  let fixture: ComponentFixture<PostsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
