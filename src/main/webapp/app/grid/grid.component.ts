// grid.component.ts
import { Component, AfterViewInit, NgZone, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { GridService } from './grid.service';
import { GridstackModule } from 'gridstack/dist/angular';
import {
  NgGridStackOptions,
  GridstackComponent,
  gsCreateNgComponents,
  NgGridStackWidget,
  nodesCB,
  BaseWidget,
} from 'gridstack/dist/angular';

import { AComponent, BComponent, CComponent } from './dummy.component';

let ids = 1;

@Component({
  imports: [CommonModule, GridstackModule],
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./gridstack.scss', './demo.scss', 'gridstack-extra.scss'],
  encapsulation: ViewEncapsulation.None,
})
export default class GridComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;
  gridElements: any[] = [];
  public gridOptions: NgGridStackOptions = {
    margin: 5,
    // float: true,
    minRow: 1,
    cellHeight: 70,
    columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
  };

  //grid: GridStack | null = null;
  private subOptions: NgGridStackOptions = {
    cellHeight: 50, // should be 50 - top/bottom
    column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
    acceptWidgets: true, // will accept .grid-stack-item by default
    margin: 5,
  };

  public items: NgGridStackWidget[] = [
    { x: 0, y: 0, minW: 2 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ];
  private sub0: NgGridStackWidget[] = [
    { x: 0, y: 0, selector: 'app-a' },
    { x: 1, y: 0, selector: 'app-a' },
    { x: 1, y: 1, content: 'plain html' },
    { x: 0, y: 1, selector: 'app-b' },
  ];
  private sub1: NgGridStackWidget[] = [
    { x: 0, y: 0, selector: 'app-a', input: { text: 'bar4711' } },
    { x: 1, y: 0, selector: 'app-b' },
    { x: 2, y: 0, selector: 'app-c' },
    { x: 3, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];
  private sub2: NgGridStackWidget[] = [
    { x: 0, y: 0 },
    { x: 0, y: 1, w: 2 },
  ];
  private subChildren: NgGridStackWidget[] = [
    { x: 0, y: 0, content: 'regular item' },
    { x: 1, y: 0, w: 4, h: 4, subGridOpts: { children: this.sub1, class: 'sub1', ...this.subOptions } },
    { x: 5, y: 0, w: 3, h: 4, subGridOpts: { children: this.sub2, class: 'sub2', ...this.subOptions } },
  ];

  public nestedGridOptions: NgGridStackOptions = {
    // main grid options
    cellHeight: 50,
    margin: 5,
    minRow: 2, // don't collapse when empty
    acceptWidgets: true,
    children: this.subChildren,
  };

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private ngZone: NgZone,
  ) {
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent]);

    // give them content and unique id to make sure we track them during changes below...
    [...this.items, ...this.subChildren, ...this.sub1, ...this.sub2, ...this.sub0].forEach((w: NgGridStackWidget) => {
      if (!w.selector && !w.content && !w.subGridOpts) w.content = `item ${ids}`;
      w.id = String(ids++);
    });
  }

  ngAfterViewInit(): void {
    /*
  scheduleUpdates(): void {
    this.gridElements.forEach(element => {
      setTimeout(() => {
        const widget = this.grid!.addWidget({
          x: element.x,
          y: element.y,
          w: element.width,
          h: element.height,
          content: `<div class="grid-stack-item-content">${element.content}</div>`,
        });
        console.log('Widget scheduled:', widget);
        setTimeout(() => this.grid!.removeWidget(widget), element.displayDurationMillis);
      }, element.displayAfterMillis);
    });*/
  }
}
