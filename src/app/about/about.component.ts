import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-about',
  imports: [MatIcon],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private data = inject(DataService);

  companies = toSignal(this.data.companies$, { initialValue: [] });
  talks = toSignal(this.data.talks$, { initialValue: [] });
  skills = toSignal(this.data.skills$, { initialValue: [] });
}
