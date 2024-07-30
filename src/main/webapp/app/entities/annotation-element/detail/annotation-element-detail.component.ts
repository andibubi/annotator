import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAnnotationElement } from '../annotation-element.model';

@Component({
  standalone: true,
  selector: 'jhi-annotation-element-detail',
  templateUrl: './annotation-element-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AnnotationElementDetailComponent {
  annotationElement = input<IAnnotationElement | null>(null);

  previousState(): void {
    window.history.back();
  }
}
