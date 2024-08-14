import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { NgGridStackWidget, NgGridStackOptions } from 'gridstack/dist/angular';
import { LayoutService } from 'app/entities/layout/service/layout.service';
import { GridElementService } from 'app/entities/grid-element/service/grid-element.service';

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
    let bla = this.http.get<IAnnotationWithElements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    this.layoutService.find(id).subscribe(r => {});
    this.gridElementService.query({ 'layoutId.equals': id }).subscribe(r => {
      debugger;
    });

    let sub1: NgGridStackWidget[] = [
      { x: 0, y: 0, h: 2, selector: 'app-yt-player', input: { name: 'sec', videoId: '7I0tBlfcg10' } },

      { x: 1, y: 1, w: 12, h: 8, selector: `app-yt-player`, input: { name: 'horst', videoId: 'NsUWXo8M7UA' } },
      { x: 1, y: 2, selector: 'widget-textout', input: { text: 'bar17' } }, // Kommentar
    ];
    let sub2: NgGridStackWidget[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1, w: 2 },
    ];
    let subOptions: NgGridStackOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
    };
    let widgets: NgGridStackWidget[] = [
      { x: 0, y: 0, w: 1, h: 1, content: 'Hallo' },
      { x: 1, y: 0, w: 10, h: 11, subGridOpts: { children: sub1, class: 'sub1', ...subOptions } },
      { x: 11, y: 0, w: 1, h: 2, subGridOpts: { children: sub2, class: 'sub2', ...subOptions } },
    ];
    // give them content and unique id to make sure we track them during changes below...
    let ids = 0;
    [...widgets, ...sub1, ...sub2].forEach((w: NgGridStackWidget) => {
      if (!w.selector && !w.content && !w.subGridOpts) w.content = `item ${ids}`;
      w.id = String(ids++);
    });

    let gridOptions: NgGridStackOptions = this.getEmptyGridOptions();
    gridOptions.children = widgets;

    let result = of(gridOptions);

    return result;
  }
}
