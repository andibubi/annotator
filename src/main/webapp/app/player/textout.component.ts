import { Component, OnDestroy, Input /*inject, OnInit, signal*/ } from '@angular/core';
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
//import { GridStack } from "gridstack";
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
    <app-context-menu17 [visible]="contextMenuVisible" [position]="contextMenuPosition" [widget]="this"> </app-context-menu17>
  `,
})
export class TextoutComponent extends BaseWidget implements OnDestroy {
  @Input() text: string = 'suchmich'; // test custom input data
  public serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }
  contextMenuVisible: boolean = false;
  contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(/*private ngZone: NgZone*/) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
    const contextMenuElement = document.querySelector('.context-menu') as HTMLElement;
    if (contextMenuElement) {
      contextMenuElement.style.left = `${this.contextMenuPosition.x}px`;
      contextMenuElement.style.top = `${this.contextMenuPosition.y}px`;
      contextMenuElement.classList.add('visible');
    }
  }
  /*constructor() {
    GridstackComponent.addComponentToSelectorType([TextoutComponent]);
  }*/
  ngOnDestroy() {
    console.log('Textout destroyed.');
  } // test to make sure cleanup happens

  /*onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }*/
}
