import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-social-links',
  imports: [MatIcon],
  templateUrl: './social-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './social-links.component.scss',
})
export class SocialLinksComponent {
  private data = inject(DataService);

  socialLinks = toSignal(this.data.socialLinks$, { initialValue: [] });
}
