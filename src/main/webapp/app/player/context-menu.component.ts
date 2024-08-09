import { Component, Input /*, OnDestroy, inject, OnInit, signal*/ } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridstackComponent,
  /*GridstackModule,
  NgGridStackOptions,
  gsCreateNgComponents,
  NgGridStackWidget,
  nodesCB,
  NgCompInputs,
  BaseWidget,*/
} from 'gridstack/dist/angular';
@Component({
  selector: 'app-context-menu17',
  imports: [CommonModule],
  standalone: true,
  template: `
    <ul *ngIf="visible" [style.top.px]="position.y" [style.left.px]="position.x" class="context-menu">
      <li (click)="detachWidget()">Widget abreißen</li>
    </ul>
  `,
  styles: [
    `
      .context-menu {
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px;
        border-radius: 5px;
      }
      .context-menu li {
        padding: 5px;
        cursor: pointer;
      }
      .context-menu li:hover {
        background-color: #555;
      }
    `,
  ],
})
export class ContextMenuComponent {
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };
  @Input() widget: any;

  constructor() {
    GridstackComponent.addComponentToSelectorType([ContextMenuComponent]);
  }

  detachWidget() {
    this.visible = false;
    this.widget.detach();
  }
}
