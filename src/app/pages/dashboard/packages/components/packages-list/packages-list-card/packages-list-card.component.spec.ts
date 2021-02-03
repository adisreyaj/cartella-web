import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesListCardComponent } from './packages-list-card.component';

describe('PackagesListCardComponent', () => {
  let component: PackagesListCardComponent;
  let fixture: ComponentFixture<PackagesListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesListCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
