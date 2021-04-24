import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksAddFolderComponent } from './bookmarks-add-folder.component';

describe('BookmarksAddFolderComponent', () => {
  let component: BookmarksAddFolderComponent;
  let fixture: ComponentFixture<BookmarksAddFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksAddFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksAddFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
