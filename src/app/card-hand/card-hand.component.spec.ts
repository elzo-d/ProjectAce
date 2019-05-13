import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHandComponent } from './card-hand.component';

describe('CardHandComponent', () => {
  let component: CardHandComponent;
  let fixture: ComponentFixture<CardHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
