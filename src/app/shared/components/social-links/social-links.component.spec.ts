import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLinksComponent } from './social-links.component';
import {
  SOCIAL_LINK_FIXTURES,
  STUB_DATA_SERVICE,
} from '../../../data/test-fixtures';
import { DataService } from '../../services/data.service';

describe('SocialLinksComponent', () => {
  let component: SocialLinksComponent;
  let fixture: ComponentFixture<SocialLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinksComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all social links', () => {
    const links = fixture.nativeElement.querySelectorAll('a[target="_blank"]');
    expect(links.length).toBe(SOCIAL_LINK_FIXTURES.length);
  });

  it('should have correct href for each link', () => {
    const anchors: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[target="_blank"]'),
    );
    SOCIAL_LINK_FIXTURES.forEach((social, i) => {
      expect(anchors[i].href).toContain(social.url);
    });
  });
});
