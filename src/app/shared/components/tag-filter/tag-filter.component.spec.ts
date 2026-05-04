import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFilterComponent } from './tag-filter.component';

describe('TagFilterComponent', () => {
  let component: TagFilterComponent;
  let fixture: ComponentFixture<TagFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagFilterComponent);
    component = fixture.componentInstance;
    component.availableTags = ['Java', 'Spring Boot', 'Vert.x'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBeFalse();
    const list = fixture.nativeElement.querySelector('ul');
    expect(list).toBeFalsy();
  });

  it('should open when the trigger button is clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
    const items = fixture.nativeElement.querySelectorAll('ul li');
    expect(items.length).toBe(component.availableTags.length);
  });

  it('should emit selectedTagsChange when a tag is toggled', () => {
    let emitted: string[] | undefined;
    component.selectedTagsChange.subscribe((tags) => (emitted = tags));

    component.toggleTag('Java');
    expect(emitted).toEqual(['Java']);

    component.toggleTag('Vert.x');
    expect(emitted!.sort()).toEqual(['Java', 'Vert.x']);

    component.toggleTag('Java');
    expect(emitted).toEqual(['Vert.x']);
  });

  it('should reflect selected count on the trigger', () => {
    component.toggleTag('Java');
    component.toggleTag('Vert.x');
    fixture.detectChanges();
    expect(component.selectedCount).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('2');
  });

  it('should clear all selections', () => {
    let emitted: string[] | undefined;
    component.selectedTagsChange.subscribe((tags) => (emitted = tags));

    component.toggleTag('Java');
    component.toggleTag('Vert.x');
    component.clear();
    expect(component.selectedCount).toBe(0);
    expect(emitted).toEqual([]);
  });
});
