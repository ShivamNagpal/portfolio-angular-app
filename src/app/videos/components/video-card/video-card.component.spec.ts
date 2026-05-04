import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCardComponent } from './video-card.component';
import { VideoItem } from '../../../data/interfaces';

const sampleVideo: VideoItem = {
  id: 'abc123',
  title: 'Sample Talk',
  description: 'A short description.',
  tags: ['Java', 'Spring Boot'],
  platform: 'youtube',
};

describe('VideoCardComponent', () => {
  let component: VideoCardComponent;
  let fixture: ComponentFixture<VideoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCardComponent);
    component = fixture.componentInstance;
    component.video = sampleVideo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render thumbnail and play button by default', () => {
    const button = fixture.nativeElement.querySelector('button');
    const iframe = fixture.nativeElement.querySelector('iframe');
    expect(button).toBeTruthy();
    expect(iframe).toBeFalsy();
  });

  it('should render iframe after play() is called', () => {
    component.play();
    fixture.detectChanges();
    const iframe = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
  });

  it('should render the title', () => {
    expect(fixture.nativeElement.textContent).toContain(sampleVideo.title);
  });

  it('should render the description when set', () => {
    expect(fixture.nativeElement.textContent).toContain(
      sampleVideo.description,
    );
  });

  it('should render tag chips when tags are present', () => {
    const text = fixture.nativeElement.textContent;
    sampleVideo.tags!.forEach((tag) => expect(text).toContain(tag));
  });
});
