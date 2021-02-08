import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeItemCardComponent } from './home-item-card.component';

describe('HomeItemCardComponent', () => {
  let component: HomeItemCardComponent;
  let fixture: ComponentFixture<HomeItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeItemCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
