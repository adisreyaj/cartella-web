import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMostRecentlyAddedComponent } from './home-most-recently-added.component';

describe('HomeMostRecentlyAddedComponent', () => {
  let component: HomeMostRecentlyAddedComponent;
  let fixture: ComponentFixture<HomeMostRecentlyAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMostRecentlyAddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMostRecentlyAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
