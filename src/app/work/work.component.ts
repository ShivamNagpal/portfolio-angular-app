import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  selectedId: string = 'Yet To Select';
  constructor(private route: ActivatedRoute) {
    route.paramMap.pipe().subscribe((params) => {
      console.log(params);
      this.selectedId = params.get('id') ?? 'Not Found';
    });
  }
}
