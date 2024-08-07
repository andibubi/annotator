import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ILayout } from '../layout.model';

@Component({
  standalone: true,
  selector: 'jhi-layout-detail',
  templateUrl: './layout-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LayoutDetailComponent {
  layout = input<ILayout | null>(null);

  previousState(): void {
    window.history.back();
  }
}
