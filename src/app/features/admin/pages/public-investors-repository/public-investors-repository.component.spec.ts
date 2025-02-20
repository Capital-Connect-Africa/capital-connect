import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInvestorsRepositoryComponent } from './public-investors-repository.component';

describe('PublicInvestorsRepositoryComponent', () => {
  let component: PublicInvestorsRepositoryComponent;
  let fixture: ComponentFixture<PublicInvestorsRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicInvestorsRepositoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicInvestorsRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
