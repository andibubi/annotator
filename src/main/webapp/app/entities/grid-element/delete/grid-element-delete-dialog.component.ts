import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGridElement } from '../grid-element.model';
import { GridElementService } from '../service/grid-element.service';

@Component({
  standalone: true,
  templateUrl: './grid-element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GridElementDeleteDialogComponent {
  gridElement?: IGridElement;

  protected gridElementService = inject(GridElementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gridElementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
