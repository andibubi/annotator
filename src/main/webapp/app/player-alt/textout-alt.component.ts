import { Component, AfterViewInit, Input, HostListener, ElementRef /*OnDestroy, inject, OnInit, signal*/ } from '@angular/core';
import {
  GridstackComponent,
  /*GridstackModule,
  NgGridStackOptions,
  gsCreateNgComponents,
  NgGridStackWidget,
  nodesCB,*/
  NgCompInputs,
  BaseWidget,
} from 'gridstack/dist/angular';
import { GridStack, GridStackNode } from 'gridstack';
//import { /*gsCreateNgComponents, gsSaveAdditionalNgInfo */} from "gridstack/dist/gridstack.component";
//import { GridstackItemComponent } from "./gridstack-item.component";
import SharedModule from 'app/shared/shared.module';
import { ContextMenuComponent } from './context-menu.component';

@Component({
  imports: [SharedModule, ContextMenuComponent],
  selector: 'widget-textout-alt',
  standalone: true,
  //template: 'TextOut {{text}}',
  template: '{{ text }}',
})
export class TextoutAltComponent extends BaseWidget implements AfterViewInit {
  @Input() text: string = 'suchmich'; // test custom input data
  public serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }

  constructor(private elementRef: ElementRef /*private ngZone: NgZone*/) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }
  private grid: any;

  ngAfterViewInit() {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    var gridElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    this.grid = gridElement.gridstack;
    //// Events s.u.
    this.grid.on('dragstart', (event: Event, el: HTMLElement, node: GridStackNode) => this.onDragStart(event, node));
    this.grid.on('dragstop', () => this.onDragEnd());
  }

  private startX = 0;
  private startY = 0;

  private floating = false;
  private draggableElement: HTMLElement | null = null; // Zuerst macht das das Grid
  private nonGridDragging = false;
  private dragInfo = { x: 0, dx: 0, y: 0, dy: 0 };

  private resizing = false;
  private resizeStartWidth: number = 0;
  private resizeStartHeight: number = 0;
  private resizeStartX: number = 0;
  private resizeStartY: number = 0;

  // Dragging im Grid
  private timerId: any;
  private movementThreshold = 20; // Bewegungsschwelle in Pixeln
  private delay = 3000; // Zeitverzögerung in ms
  private gridDragging = false;
  onDragStart(event: any, node: any) {
    this.gridDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTimer();
  }

  startTimer() {
    this.timerId = setTimeout(() => {
      this.makeFloating();
    }, this.delay);
  }

  resetTimer() {
    clearTimeout(this.timerId);
    this.startTimer();
  }

  makeFloating() {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;

    var gridDomElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    this.grid = gridDomElement.gridstack;

    var gridItemDomElement = nativeElement.closest('.grid-stack-item')!;
    this.grid.removeWidget(gridItemDomElement, false, true);

    this.draggableElement = gridItemDomElement.querySelector('.grid-stack-item-content')! as HTMLElement;
    let de = this.draggableElement;
    de.style.position = 'absolute';
    de.classList.add('draggable');
    de.addEventListener('mousedown', e => this.onMouseDown(e));
    de.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    de.addEventListener('mouseup', e => this.onMouseUp(e));

    this.floating = true;
    alert('floating');
  }

  onDragEnd() {
    clearTimeout(this.timerId);
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.floating || event.target != this.draggableElement) return;

    event.stopPropagation(); // Stop the event from reaching the grid
    event.preventDefault();
    this.grid.enableMove(false);
    var target = this.draggableElement!;
    if (target.classList.contains('resizable') && event.offsetX > target.offsetWidth - 10 && event.offsetY > target.offsetHeight - 10) {
      this.resizing = true;
      this.resizeStartWidth = target.offsetWidth;
      this.resizeStartHeight = target.offsetHeight;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
    } else {
      this.dragInfo.x = event.clientX - this.dragInfo.dx;
      this.dragInfo.y = event.clientY - this.dragInfo.dy;
      this.nonGridDragging = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.floating && this.gridDragging) {
      const deltaX = Math.abs(event.clientX - this.startX);
      const deltaY = Math.abs(event.clientY - this.startY);

      console.log('!!!1222234');
      if (deltaX > this.movementThreshold || deltaY > this.movementThreshold) {
        // Reset the timer if the movement exceeds the threshold
        this.resetTimer();
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    }
    if (!this.floating || (event.target != this.draggableElement && !this.nonGridDragging))
      // sonst reissts ab, wen man schnell draggt
      return;

    if (this.floating) {
      if (this.resizing) {
        event.preventDefault();
        var target = this.draggableElement!;
        const newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX);
        const newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY);
        target.style.width = `${newWidth}px`;
        target.style.height = `${newHeight}px`;
      } else if (this.nonGridDragging) {
        event.preventDefault();
        this.dragInfo.dx = event.clientX - this.dragInfo.x;
        this.dragInfo.dy = event.clientY - this.dragInfo.y;
        this.draggableElement!.style.transform = `translate3d(${this.dragInfo.dx}px, ${this.dragInfo.dy}px, 0)`;
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.target != this.draggableElement) return;

    this.gridDragging = false;
    this.nonGridDragging = false;
    this.resizing = false;
    this.grid.enableMove(true);
  }
}
