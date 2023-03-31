import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailNewComponent } from './ticket-detail-new.component';

describe('TicketDetailNewComponent', () => {
  let component: TicketDetailNewComponent;
  let fixture: ComponentFixture<TicketDetailNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
