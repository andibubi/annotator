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
    this.grid = GridStack.init();
    this.route.paramMap.subscribe(params => {
      this.gridService.getGridElements(/*Number(params.get('annotationId'))*/).subscribe(
        response => {
          this.gridElements = response as any[];
          this.scheduleUpdates();
        },
        error => {
          console.error('Error', error);
        },
      );
    });
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
