import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAnnotation } from '../annotation.model';

@Component({
  standalone: true,
  selector: 'jhi-annotation-detail',
  templateUrl: './annotation-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AnnotationDetailComponent {
  annotation = input<IAnnotation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
