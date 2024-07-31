import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step2',
  standalone: true,
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  nextStep() {
    this.next.emit();
  }

  prevStep() {
    this.prev.emit();
  }
}
