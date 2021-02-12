import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkAddPreviewComponent } from './bookmark-add-preview.component';

describe('BookmarkAddPreviewComponent', () => {
  let component: BookmarkAddPreviewComponent;
  let fixture: ComponentFixture<BookmarkAddPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarkAddPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkAddPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
