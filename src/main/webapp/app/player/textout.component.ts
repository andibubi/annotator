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
    <div class="grid-stack-item-content" (contextmenu)="onRightClick($event)">Widget Inhalt</div>
    <app-context-menu17 [visible]="contextMenuVisible" [position]="contextMenuPosition" [widget]="this"> </app-context-menu17>
  `,
})
export class TextoutComponent implements OnDestroy {
  /*@Input() text: string = 'suchmich'; // test custom input data
  public override serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }*/
  contextMenuVisible: boolean = false;
  contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }
  constructor() {
    GridstackComponent.addComponentToSelectorType([TextoutComponent]);
  }
  ngOnDestroy() {
    console.log('Textout destroyed.');
  } // test to make sure cleanup happens

  /*onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }*/
}
