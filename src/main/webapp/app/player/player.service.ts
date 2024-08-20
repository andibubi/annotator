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
import { YtPlayerService } from 'app/yt-player/yt-player.service';
import { IGridElement } from '../entities/grid-element/grid-element.model';
import { TextoutComponent } from './textout.component';
import YtPlayerComponent from '../yt-player/yt-player.component';

export type EntityResponseType = HttpResponse<IAnnotationWithElements>;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  constructor(
    private layoutService: LayoutService,
    private gridElementService: GridElementService,
    private ytPlayerService: YtPlayerService,
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

  startUpdateTimer() {
    setInterval(this.timerTick.bind(this), 1000);
  }
  timerTick() {
    let org = this.ytPlayerService.nameSuffix2player.get('org');
    if (org) {
      var secs = org.getCurrentTime();
      for (let [name, textout] of this.name2textout) textout.update(secs);
      for (let [name, ytPlayer] of this.name2ytPlayer) ytPlayer.update(secs);
    }
  }

  name2textout: Map<string, TextoutComponent> = new Map();
  registerTextout(name: string, textout: TextoutComponent) {
    this.name2textout.set(name, textout);
  }

  name2ytPlayer: Map<string, YtPlayerComponent> = new Map();
  registerYtPlayer(name: string, ytPlayer: YtPlayerComponent) {
    this.name2ytPlayer.set(name, ytPlayer);
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
        return {
          name: item.channel,
          videoId: item.content,
          commands: item.channel == 'sec' ? [{ timeSec: 10, videoId: 'a5hZstgIiRY' }] : [],
        };
      case 'widget-textout':
        return {
          name: item.channel,
          text: item.content,
          commands: [
            { timeSec: 0, text: 'Dieses Fensterchen kann man vergrößern...' },
            { timeSec: 3, text: '...oder verschieben.' },
            { timeSec: 10, text: 'Oben startet ein anderes Video.' },
          ],
        };
      default:
        return {};
    }
  }
}
