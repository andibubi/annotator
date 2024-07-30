import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAnnotation } from '../annotation.model';
import { AnnotationService } from '../service/annotation.service';

@Component({
  standalone: true,
  templateUrl: './annotation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AnnotationDeleteDialogComponent {
  annotation?: IAnnotation;

  protected annotationService = inject(AnnotationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.annotationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
