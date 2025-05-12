import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartEquivalentComponent } from './part-equivalent.component';

describe('PartEquivalentComponent', () => {
  let component: PartEquivalentComponent;
  let fixture: ComponentFixture<PartEquivalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartEquivalentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartEquivalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
