import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKeyComponent } from './edit-key.component';

describe('EditKeyComponent', () => {
  let component: EditKeyComponent;
  let fixture: ComponentFixture<EditKeyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditKeyComponent]
    });
    fixture = TestBed.createComponent(EditKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
