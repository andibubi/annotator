import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVideoAnnotationElement } from '../video-annotation-element.model';
import { VideoAnnotationElementService } from '../service/video-annotation-element.service';

@Component({
  standalone: true,
  templateUrl: './video-annotation-element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VideoAnnotationElementDeleteDialogComponent {
  videoAnnotationElement?: IVideoAnnotationElement;

  protected videoAnnotationElementService = inject(VideoAnnotationElementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.videoAnnotationElementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
