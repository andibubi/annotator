import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { NgGridStackWidget, NgGridStackOptions } from 'gridstack/dist/angular';
import { LayoutService } from 'app/entities/layout/service/layout.service';
import { GridElementService } from 'app/entities/grid-element/service/grid-element.service';
import { IGridElement } from '../entities/grid-element/grid-element.model';

export type EntityResponseType = HttpResponse<IAnnotationWithElements>;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  constructor(
    private layoutService: LayoutService,
    private gridElementService: GridElementService,
  ) {}

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/view');

  getEmptyGridOptions(): NgGridStackOptions {
    return {
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      children: [],
    };
  }
  getInitialSched$(id: number): Observable<NgGridStackOptions> {
    this.layoutService.find(id).subscribe(r => {});

    let r = this.gridElementService.query({ 'layoutId.equals': id }).pipe(
      map(response => {
        let roots = [];
        const items = response.body! as IGridElement[];
        let id2item: Map<number, any> = new Map();

        // Items in die Map speichern und Wurzeln identifizieren
        for (let item of items) {
          id2item.set(item.id, item);
          if (!item.gridElement) {
            roots.push(item);
          }
        }

        // Initialisiere Kinder-Arrays
        for (let item of items) {
          (item as any).children = [];
        }

        // Kinder den entsprechenden Eltern-Items hinzufügen
        for (let item of items) {
          if (item.gridElement) {
            id2item.get(item.gridElement.id).children.push(item);
          }
        }

        // Erzeuge die NgGridStackOptions aus den Wurzeln (roots)
        const widgets = this.createGridOptions(roots);
        let gridOptions: NgGridStackOptions = this.getEmptyGridOptions();
        gridOptions.children = widgets;

        return gridOptions;
      }),
    );
    return r;
  }
  private createGridOptions(items: any[]) {
    let result: NgGridStackOptions[] = [];
    let subOptions: NgGridStackOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
    };
    for (let item of items) {
      var r = { x: item.x, y: item.y, w: item.w, h: item.h };
      if (item.children.length > 0) {
        let ccc = this.createGridOptions(item.children);
        (r as any).subGridOpts = { children: ccc, class: 'sub1', ...subOptions };
      } else {
        (r as any).selector = item.renderer;
        (r as any).input = this.createInput(item);
      }
      result.push(r as NgGridStackOptions);
    }
    return result;
  }
  private createInput(item: any) {
    switch (item.renderer) {
      case 'app-yt-player':
        return { name: item.channel, videoId: item.content };
      case 'widget-textout':
        return { text: item.content };
      default:
        return {};
    }
  }
}
