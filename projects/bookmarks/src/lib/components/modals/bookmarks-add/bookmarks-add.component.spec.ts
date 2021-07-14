import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksAddComponent } from './bookmarks-add.component';

describe('BookmarksAddComponent', () => {
  let component: BookmarksAddComponent;
  let fixture: ComponentFixture<BookmarksAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
