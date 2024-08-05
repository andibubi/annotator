import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITextAnnotationElement } from '../text-annotation-element.model';

@Component({
  standalone: true,
  selector: 'jhi-text-annotation-element-detail',
  templateUrl: './text-annotation-element-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TextAnnotationElementDetailComponent {
  textAnnotationElement = input<ITextAnnotationElement | null>(null);

  previousState(): void {
    window.history.back();
  }
}
