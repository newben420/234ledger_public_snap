import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappeningComponent } from './happening.component';

describe('HappeningComponent', () => {
  let component: HappeningComponent;
  let fixture: ComponentFixture<HappeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HappeningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
