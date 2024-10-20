import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
//import { map, catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { NgGridStackWidget, NgGridStackOptions } from 'gridstack/dist/angular';
import { LayoutService } from 'app/entities/layout/service/layout.service';
import { GridElementService } from 'app/entities/grid-element/service/grid-element.service';
import { YtPlayerService } from 'app/yt-player/yt-player.service';
import { AudioService } from './audio.service';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IGridElement } from '../entities/grid-element/grid-element.model';
import { TextoutComponent } from './textout.component';
import { AdvancedGrid } from '../advanced-grid/advanced-grid';
import YtPlayerComponent from '../yt-player/yt-player.component';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  constructor(
    private layoutService: LayoutService,
    private gridElementService: GridElementService,
    private ytPlayerService: YtPlayerService,
    private audioService: AudioService,
  ) {}

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/view');

  advGrid: AdvancedGrid | null = null;

  getEmptyGridOptions(): NgGridStackOptions {
    return {
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      children: [],
    };
  }
  channel2gridElement: Map<string, IGridElement> = new Map();
  getInitialSched$(id: number): Observable<NgGridStackOptions> {
    this.layoutService.find(id).subscribe(r => {});

    let r = this.gridElementService.query({ 'layoutId.equals': id }).pipe(
      map(response => {
        this.channel2gridElement = new Map();
        let roots = this.createGridItemTree(response.body!); // GridItemElement[]

        // Erzeuge die NgGridStackOptions aus den Wurzeln (roots)
        const widgets = this.createGridOptions(roots);
        let gridOptions: NgGridStackOptions = this.getEmptyGridOptions();
        gridOptions.children = widgets;

        return gridOptions;
      }),
    );
    return r;
  }
  pauseAll(pause: boolean) {
    for (let [name, ytPlayer] of this.channel2ytPlayer) ytPlayer.pause(pause);
  }

  startUpdateTimer() {
    setInterval(this.timerTick.bind(this), 1000);
  }
  timerTick() {
    let orgPlayer = this.getOrgPlayer();
    // TODO: orgPlayer.getCurrentTime sollte hier immer definiert sein.
    if (orgPlayer) {
      let secs = orgPlayer.getCurrentTime ? orgPlayer.getCurrentTime() : 0;
      for (let [name, textout] of this.channel2textout) textout.update(secs);
      for (let [name, ytPlayer] of this.channel2ytPlayer) ytPlayer.update(secs);
    }
  }
  getOrgPlayer() {
    return this.ytPlayerService.nameSuffix2player.get('org');
  }

  channel2textout: Map<string, TextoutComponent> = new Map();
  registerTextout(channel: string, textout: TextoutComponent) {
    this.channel2textout.set(channel, textout);
  }

  channel2ytPlayer: Map<string, YtPlayerComponent> = new Map();
  registerYtPlayer(channel: string, ytPlayer: YtPlayerComponent) {
    this.channel2ytPlayer.set(channel, ytPlayer);
  }
  createTextAnnotation(text: string): Observable<boolean> {
    let orgPlayer = this.getOrgPlayer();

    let channel = 'cmt'; // TODO Param
    let gridElement = this.channel2gridElement.get(channel)!;
    let content = JSON.parse(gridElement.content!);
    content.commands.push({ timeSec: orgPlayer.getCurrentTime(), text: text });
    gridElement.content = JSON.stringify(content);

    return this.http.put<IGridElement>('/api/createBlablubb', gridElement, { observe: 'response' }).pipe(
      map((response: HttpResponse<IGridElement>) => {
        // TODO Hack: Wenn das Layout nicht dem User zugeordnet ist, dann enthält response.body
        // ein GridElement dessen Layout neu erstellt wurde (und nun dem Benutzer zugeordnet ist).
        let newLayoutId = response!.body!.id;
        if (gridElement.id !== newLayoutId) {
          this.gridElementService.query({ 'layoutId.equals': newLayoutId }).pipe(
            map(response => {
              this.channel2gridElement = new Map();
              let roots = this.createGridItemTree(response.body!); // GridItemElement[]
            }),
          );
        } else {
          let textout = this.channel2textout.get(channel)!;
          textout.content = JSON.parse(response.body!.content!);
        }
        return true;
      }),
      catchError((error: any) => of(false)),
    );
  }
  createVideoAnnotation(videoId: string, startSec: number): Observable<boolean> {
    let orgPlayer = this.getOrgPlayer();

    let channel = 'sec'; // TODO Param
    let gridElement = this.channel2gridElement!.get(channel)!;
    let content = JSON.parse(gridElement.content!);
    content.commands.push({ timeSec: orgPlayer.getCurrentTime(), videoId: videoId, videoStartSec: startSec });
    gridElement.content = JSON.stringify(content);
    return this.gridElementService.update(gridElement).pipe(
      map((response: HttpResponse<IGridElement>) => {
        let ytPlayer = this.channel2ytPlayer.get(channel)!;
        ytPlayer.content = JSON.parse(response.body!.content!);
        return true;
      }),
      catchError((error: any) => of(false)),
    );
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
  private createGridItemTree(items: IGridElement[]) {
    let roots = [];
    this.channel2gridElement!.clear();
    let id2item: Map<number, any> = new Map();

    // Items in die Map speichern und Wurzeln identifizieren
    for (let item of items) {
      id2item.set(item.id, item);
      this.channel2gridElement!.set(item.channel!, item);
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
    return roots;
  }

  onYtPlayerStateChange(name: string, event: any) {
    /*
    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued).
    */
    // if (name == 'org' && event.data == 1)
    // this.audioService.playMP3('content/oops.mp3');
  }
  private createInput(item: any) {
    return {
      name: item.channel,
      content: JSON.parse(item.content),
    };
  }
}
