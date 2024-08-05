import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IVideoAnnotationElement } from '../video-annotation-element.model';

@Component({
  standalone: true,
  selector: 'jhi-video-annotation-element-detail',
  templateUrl: './video-annotation-element-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VideoAnnotationElementDetailComponent {
  videoAnnotationElement = input<IVideoAnnotationElement | null>(null);

  previousState(): void {
    window.history.back();
  }
}
