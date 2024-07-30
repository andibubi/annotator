import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAnnotationElement } from '../annotation-element.model';
import { AnnotationElementService } from '../service/annotation-element.service';

@Component({
  standalone: true,
  templateUrl: './annotation-element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AnnotationElementDeleteDialogComponent {
  annotationElement?: IAnnotationElement;

  protected annotationElementService = inject(AnnotationElementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.annotationElementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
