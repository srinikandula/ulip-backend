import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchulipComponent } from './fetchulip.component';

describe('FetchulipComponent', () => {
  let component: FetchulipComponent;
  let fixture: ComponentFixture<FetchulipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchulipComponent]
    });
    fixture = TestBed.createComponent(FetchulipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
