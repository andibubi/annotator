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
  styleUrl: './context-menu.component.scss',
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
