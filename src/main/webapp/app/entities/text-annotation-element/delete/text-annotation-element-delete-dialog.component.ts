import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITextAnnotationElement } from '../text-annotation-element.model';
import { TextAnnotationElementService } from '../service/text-annotation-element.service';

@Component({
  standalone: true,
  templateUrl: './text-annotation-element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TextAnnotationElementDeleteDialogComponent {
  textAnnotationElement?: ITextAnnotationElement;

  protected textAnnotationElementService = inject(TextAnnotationElementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.textAnnotationElementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
