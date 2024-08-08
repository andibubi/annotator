import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILayout } from 'app/entities/layout/layout.model';
import { LayoutService } from 'app/entities/layout/service/layout.service';
import { IGridElement } from '../grid-element.model';
import { GridElementService } from '../service/grid-element.service';
import { GridElementFormService, GridElementFormGroup } from './grid-element-form.service';

@Component({
  standalone: true,
  selector: 'jhi-grid-element-update',
  templateUrl: './grid-element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GridElementUpdateComponent implements OnInit {
  isSaving = false;
  gridElement: IGridElement | null = null;

  layoutsSharedCollection: ILayout[] = [];
  gridElementsSharedCollection: IGridElement[] = [];

  protected gridElementService = inject(GridElementService);
  protected gridElementFormService = inject(GridElementFormService);
  protected layoutService = inject(LayoutService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GridElementFormGroup = this.gridElementFormService.createGridElementFormGroup();

  compareLayout = (o1: ILayout | null, o2: ILayout | null): boolean => this.layoutService.compareLayout(o1, o2);

  compareGridElement = (o1: IGridElement | null, o2: IGridElement | null): boolean => this.gridElementService.compareGridElement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gridElement }) => {
      this.gridElement = gridElement;
      if (gridElement) {
        this.updateForm(gridElement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gridElement = this.gridElementFormService.getGridElement(this.editForm);
    if (gridElement.id !== null) {
      this.subscribeToSaveResponse(this.gridElementService.update(gridElement));
    } else {
      this.subscribeToSaveResponse(this.gridElementService.create(gridElement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGridElement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(gridElement: IGridElement): void {
    this.gridElement = gridElement;
    this.gridElementFormService.resetForm(this.editForm, gridElement);

    this.layoutsSharedCollection = this.layoutService.addLayoutToCollectionIfMissing<ILayout>(
      this.layoutsSharedCollection,
      gridElement.layout,
    );
    this.gridElementsSharedCollection = this.gridElementService.addGridElementToCollectionIfMissing<IGridElement>(
      this.gridElementsSharedCollection,
      gridElement.gridElement,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.layoutService
      .query()
      .pipe(map((res: HttpResponse<ILayout[]>) => res.body ?? []))
      .pipe(map((layouts: ILayout[]) => this.layoutService.addLayoutToCollectionIfMissing<ILayout>(layouts, this.gridElement?.layout)))
      .subscribe((layouts: ILayout[]) => (this.layoutsSharedCollection = layouts));

    this.gridElementService
      .query()
      .pipe(map((res: HttpResponse<IGridElement[]>) => res.body ?? []))
      .pipe(
        map((gridElements: IGridElement[]) =>
          this.gridElementService.addGridElementToCollectionIfMissing<IGridElement>(gridElements, this.gridElement?.gridElement),
        ),
      )
      .subscribe((gridElements: IGridElement[]) => (this.gridElementsSharedCollection = gridElements));
  }
}
