import { Component, OnDestroy, AfterViewInit, Input, ElementRef /*inject, OnInit, signal*/ } from '@angular/core';
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
  selector: 'widget-textout',
  standalone: true,
  //template: 'TextOut {{text}}',
  template: `
    <div class="grid-stack-item-content" (contextmenu)="onRightClick($event)">{{ text }}</div>
    <div id="menu-overlay" [style.display]="contextMenuVisible ? 'block' : 'none'" class="draggable">
      <button id="menu-button" (click)="setFullscreen(false)">Menü</button>
    </div>
  `,
})
export class TextoutComponent extends BaseWidget implements OnDestroy, AfterViewInit {
  @Input() text: string = 'suchmich'; // test custom input data
  public serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }
  contextMenuVisible: boolean = false;
  contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private elementRef: ElementRef /*private ngZone: NgZone*/) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }

  ngAfterViewInit() {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    var gridElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    var grid = gridElement.gridstack;
    grid.on('dragstart', (event: Event, el: HTMLElement, node: GridStackNode) => this.onDragStart(event, node));
    grid.on('dragstop', () => this.onDragEnd());
  }

  setFullscreen(fullscreen: boolean) {
    alert('tach');
  }
  private timeoutId: any;
  onDragStart(event: any, node: any) {
    this.timeoutId = setTimeout(() => {
      const nativeElement = this.elementRef.nativeElement as HTMLElement;
      var gridDomElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
      var grid = gridDomElement.gridstack;
      var gridItemDomElement = nativeElement.closest('.grid-stack-item')!; // as HTMLElement & { gridstackNode?: any };
      debugger;
      grid.removeWidget(gridItemDomElement, false, true);
      const widget = gridItemDomElement.querySelector('.grid-stack-item-content')! as HTMLElement;
      widget.style.position = 'absolute';
      widget.style.left = '0px';
      widget.classList.add('draggable');

      //this.changeGridItem(node);
    }, 2000); // 2000 ms = 2 Sekunden
  }

  onDragEnd() {
    clearTimeout(this.timeoutId);
  }

  ngOnDestroy() {
    console.log('Textout destroyed.');
  } // test to make sure cleanup happens
}
