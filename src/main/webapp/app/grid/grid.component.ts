// grid.component.ts
import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GridStack } from 'gridstack';
import { ActivatedRoute } from '@angular/router';
import { GridService } from './grid.service';

@Component({
  imports: [CommonModule],
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export default class GridComponent implements OnInit, AfterViewInit {
  gridElements: any[] = [];
  grid: GridStack | null = null;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let subOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
      subGridDynamic: true, // make it recursive for all future sub-grids
    };
    let main = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];
    let sub1 = [{ x: 0, y: 0 }];
    let sub0 = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    // let sub0 = [{x:0, y:0}, {x:1, y:0}, {x:1, y:1, h:2, subGridOpts: {children: sub1, ...subOptions}}];
    let options = {
      // main grid options
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      subGridOpts: subOptions,
      subGridDynamic: true, // v7 api to create sub-grids on the fly
      children: [
        ...main,
        { x: 2, y: 0, w: 2, h: 3, id: 'sub0', subGridOpts: { children: sub0, ...subOptions } },
        { x: 4, y: 0, h: 2, id: 'sub1', subGridOpts: { children: sub1, ...subOptions } },
        // {x:2, y:0, w:2, h:3, subGridOpts: {children: [...sub1, {x:0, y:1, subGridOpts: subOptions}], ...subOptions}/*,content: "<div>nested grid here</div>"*/},
      ],
    };

    let count = 0;
    // create unique ids+content so we can incrementally load() and not re-create anything (updates)
    [...main, ...sub0, ...sub1].forEach(d => (d.id = d.content = String(count++)));

    this.grid = GridStack.init();
    this.grid.addWidget(options);
    /*
    this.route.paramMap.subscribe(params => {
      this.gridService.getGridElementsByLayout(Number(params.get('layoutId'))).subscribe(
        response => {
          this.gridElements = response as any[];
          this.scheduleUpdates();
        },
        error => {
          console.error('Error', error);
        },
      );
    });
  */
  }

  scheduleUpdates(): void {
    this.gridElements.forEach(element => {
      setTimeout(() => {
        this.grid!.addWidget({
          x: element.x,
          y: element.y,
          w: element.width,
          h: element.height,
          content: element.content,
        });
        setTimeout(() => this.grid!.removeWidget(element), element.displayDurationMillis);
      }, element.displayAfterMillis);
    });
  }
}
