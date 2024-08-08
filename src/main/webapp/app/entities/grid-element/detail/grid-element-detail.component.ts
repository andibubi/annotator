import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IGridElement } from '../grid-element.model';

@Component({
  standalone: true,
  selector: 'jhi-grid-element-detail',
  templateUrl: './grid-element-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GridElementDetailComponent {
  gridElement = input<IGridElement | null>(null);

  previousState(): void {
    window.history.back();
  }
}
