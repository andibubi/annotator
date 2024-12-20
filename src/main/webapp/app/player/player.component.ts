import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IAnnotation } from '../entities/annotation/annotation.model';
import { AccountService } from 'app/core/auth/account.service';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IVideoAnnotationElement } from '../entities/video-annotation-element/video-annotation-element.model';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { PlayerService } from './player.service';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { GridStack, GridStackOptions } from 'gridstack';
import { AdvancedGrid } from '../advanced-grid/advanced-grid';
import {
  GridstackModule,
  NgGridStackOptions,
  GridstackComponent,
  gsCreateNgComponents,
  NgGridStackWidget,
  nodesCB,
  BaseWidget,
} from 'gridstack/dist/angular';

import { AComponent, BComponent, CComponent } from './dummy.component';
import YtPlayerComponent from '../yt-player/yt-player.component';
import { YService } from '../yt-player/y.service';
import { TextoutComponent } from './textout.component';

// Neues Interface, das das Original erweitert
export interface NgGridStackWidgetWithGrid extends NgGridStackWidget {
  grid?: any; // Typ des Grids anpassen, wenn bekannt
}

@Component({
  imports: [CommonModule, GridstackModule, YtPlayerComponent, AdvancedGrid, FormsModule],
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './gridstack.scss', './demo.scss', 'gridstack-extra.scss'],
  encapsulation: ViewEncapsulation.None,
})
export default class PlayerComponent implements OnInit {
  isFullscreen: boolean = false;

  showTextAnnotationDialog: boolean = false;
  newTextAnnotationText: string = '';

  showVideoAnnotationDialog: boolean = false;
  newVideoAnnotationIdOrUrl: string = '';
  newVideoAnnotationStartSec: number = 0;

  draggingElement: HTMLElement | null = null;
  dragInfos: Map<HTMLElement, any> = new Map();

  resizingElement: HTMLElement | null = null;
  resizeStartWidth: number = 0;
  resizeStartHeight: number = 0;
  resizeStartX: number = 0;
  resizeStartY: number = 0;
  gridOptions$: Observable<NgGridStackOptions> = of(); // Für Html

  // TODO Den ganzen emptyGrid-Kram rausschmeißen?
  // Gibt es einen Zusammenhang zum Bug beim Float-Verschieben?
  emptyGridOptions!: NgGridStackOptions;

  private isGridInitialized = false; // Flag zur Überprüfung, ob die Methode bereits aufgerufen wurde

  constructor(
    private yService: YService,
    private el: ElementRef,
    private renderer: Renderer2,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private ngZone: NgZone,
  ) {
    GridstackComponent.addComponentToSelectorType([TextoutComponent, YtPlayerComponent]);
  }
  @ViewChild('gridstack', { static: true }) gridstack!: ElementRef; // TODO Im debugger undefined, wird nicht verwendet=>weg
  @ViewChild('advgridstack', { static: false }) advGrid!: AdvancedGrid;

  isAuthenticated = false;
  ngOnInit() {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.isAuthenticated = !!account;
    });
    this.emptyGridOptions = this.playerService.getEmptyGridOptions();
    this.route.paramMap.subscribe(params => {
      this.createGrid(Number(params.get('layoutId')), true);
    });
  }

  createGrid(layoutId: number, startUpdateTimer: boolean) {
    this.gridOptions$ = this.playerService.getInitialSched$(layoutId);
    this.gridOptions$.subscribe(gridOptions => {
      if (!startUpdateTimer) this.advGrid.destroy();
      this.advGrid.work(gridOptions);
      if (startUpdateTimer) this.playerService.startUpdateTimer();
    });
  }

  setFullscreen(fullscreen: boolean) {
    this.isFullscreen = fullscreen;
    // TODO Nicht an Angular vorbei
    let display = fullscreen ? 'none' : 'unset';
    Array.from(document.getElementsByClassName('not-fullscreen')).forEach(nfs => ((nfs as HTMLElement).style.display = display));
  }

  startTextAnnotation() {
    this.playerService.pauseAll(true);
    this.showTextAnnotationDialog = true;
  }

  startVideoAnnotation() {
    this.playerService.pauseAll(true);
    this.showVideoAnnotationDialog = true;
  }

  showAnnotationUrl() {
    /*
    this.annotationService.getQrCode(this.annotation!.id).subscribe(
      data => {
        this.qrCodeData = data;
      },
      error => {
        console.error('Error generating QR code', error);
      },
    );
    */
  }

  saveTextAnnotation() {
    this.playerService.createTextAnnotation(this.newTextAnnotationText).subscribe((returnedLayoutId: number) => {
      if (returnedLayoutId >= 0) {
        console.log('Textannotation erfolgreich erstellt!');
        this.showTextAnnotationDialog = false;
        this.newTextAnnotationText = '';
        if (returnedLayoutId > 0) this.createGrid(returnedLayoutId, false);
        this.playerService.pauseAll(false);
      } else {
        debugger;
        console.log('Fehler beim Erstellen der Textannotation.');
      }
    });
  }

  invalidVideoAnnotationIdOrUrl = false;
  validateVideoAnnotationIdOrUrlPattern() {
    this.invalidVideoAnnotationIdOrUrl = this.yService.getVideoId(this.newVideoAnnotationIdOrUrl) == null;
  }

  saveVideoAnnotation() {
    this.playerService
      .createVideoAnnotation(this.yService.getVideoId(this.newVideoAnnotationIdOrUrl)!, this.newVideoAnnotationStartSec)
      .subscribe((success: boolean) => {
        if (success) {
          console.log('Videoannotation erfolgreich erstellt!');
          this.playerService.pauseAll(false);
          this.showVideoAnnotationDialog = false;
          this.newVideoAnnotationIdOrUrl = '';
        } else {
          debugger;
          console.log('Fehler beim Erstellen der Videoannotation.');
        }
      });
  }

  //@HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLElement && target.classList.contains('draggable')) {
      event.preventDefault();
      if (target.classList.contains('resizable') && event.offsetX > target.offsetWidth - 10 && event.offsetY > target.offsetHeight - 10) {
        this.resizingElement = target;
        this.resizeStartWidth = target.offsetWidth;
        this.resizeStartHeight = target.offsetHeight;
        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;
      } else {
        var dragInfo = this.dragInfos.get(target);
        if (!dragInfo) {
          dragInfo = { x: 0, dx: 0, y: 0, dy: 0 };
          this.dragInfos.set(target, dragInfo);
        }
        dragInfo.x = event.clientX - dragInfo.dx;
        dragInfo.y = event.clientY - dragInfo.dy;
        this.draggingElement = target;
      }
    }
  }

  //@HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    console.log('---------');
    if (this.resizingElement) {
      event.preventDefault();
      const newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX);
      const newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY);
      this.resizingElement.style.width = `${newWidth}px`;
      this.resizingElement.style.height = `${newHeight}px`;
    } else if (this.draggingElement) {
      event.preventDefault();
      var dragInfo = this.dragInfos.get(this.draggingElement);

      dragInfo.dx = event.clientX - dragInfo.x;
      dragInfo.dy = event.clientY - dragInfo.y;

      this.draggingElement.style.transform = `translate3d(${dragInfo.dx}px, ${dragInfo.dy}px, 0)`;
    }
  }

  //@HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.draggingElement = null;
    if (this.resizingElement) {
      if (this.resizingElement.id === 'video-overlay') this.resizeYoutubePlayer();
      this.resizingElement = null;
    }
  }
  resizeYoutubePlayer() {
    /*
    if (this.annotationYoutubePlayer) {
      const overlay = document.getElementById('video-overlay');
      if (overlay) {
        const newWidth = overlay.clientWidth;
        const newHeight = overlay.clientHeight;
        this.annotationYoutubePlayer.setSize(newWidth, newHeight);
      }
    }
  */
  }
}
