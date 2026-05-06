import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tag-filter',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './tag-filter.component.html',
  styleUrl: './tag-filter.component.scss',
})
export class TagFilterComponent {
  private host = inject(ElementRef<HTMLElement>);

  @Input() availableTags: string[] = [];
  @Input() label = 'Filter by tag';

  @Output() selectedTagsChange = new EventEmitter<string[]>();

  isOpen = signal(false);
  selected = signal<Set<string>>(new Set());

  get selectedCount() {
    return this.selected().size;
  }

  toggleOpen() {
    this.isOpen.update((v) => !v);
  }

  toggleTag(tag: string) {
    const next = new Set(this.selected());
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    this.selected.set(next);
    this.selectedTagsChange.emit(Array.from(next));
  }

  isSelected(tag: string) {
    return this.selected().has(tag);
  }

  clear() {
    if (this.selected().size === 0) return;
    this.selected.set(new Set());
    this.selectedTagsChange.emit([]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isOpen()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
