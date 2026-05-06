import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import {
  COMPANY_FIXTURES,
  SKILL_FIXTURES,
  STUB_DATA_SERVICE,
  TALK_FIXTURES,
} from '../data/test-fixtures';
import { DataService } from '../shared/services/data.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render every company name', () => {
    const text = fixture.nativeElement.textContent;
    COMPANY_FIXTURES.forEach((c) => expect(text).toContain(c.name));
  });

  it('should mark the current company with a Now tag', () => {
    const current = COMPANY_FIXTURES.find((c) => c.current);
    if (!current) return;
    expect(fixture.nativeElement.textContent).toContain('Now');
  });

  it('should render every skill across all groups', () => {
    const text = fixture.nativeElement.textContent;
    SKILL_FIXTURES.forEach((g) =>
      g.items.forEach((item) => expect(text).toContain(item)),
    );
  });

  it('should render every talk title', () => {
    const text = fixture.nativeElement.textContent;
    TALK_FIXTURES.forEach((t) => expect(text).toContain(t.title));
  });
});
