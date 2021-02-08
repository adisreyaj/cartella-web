import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeTopItemsComponent } from './home-top-items.component';

describe('HomeStopItemsComponent', () => {
  let component: HomeTopItemsComponent;
  let fixture: ComponentFixture<HomeTopItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTopItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTopItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
