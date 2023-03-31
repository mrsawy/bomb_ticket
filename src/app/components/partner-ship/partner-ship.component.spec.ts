import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerShipComponent } from './partner-ship.component';

describe('PartnerShipComponent', () => {
  let component: PartnerShipComponent;
  let fixture: ComponentFixture<PartnerShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
