import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamebarComponent } from './gamebar.component';

describe('GamebarComponent', () => {
  let component: GamebarComponent;
  let fixture: ComponentFixture<GamebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
