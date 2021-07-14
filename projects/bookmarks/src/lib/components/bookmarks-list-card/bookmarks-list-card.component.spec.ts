import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksListCardComponent } from './bookmarks-list-card.component';

describe('BookmarksListCardComponent', () => {
  let component: BookmarksListCardComponent;
  let fixture: ComponentFixture<BookmarksListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksListCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
