import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDashboard } from './hr-dashboard';

describe('HrDashboard', () => {
  let component: HrDashboard;
  let fixture: ComponentFixture<HrDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
