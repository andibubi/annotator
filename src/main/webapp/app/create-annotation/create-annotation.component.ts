import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Step2Component } from '../step2/step2.component';

@Component({
  selector: 'jhi-create-annotation',
  standalone: true,
  imports: [CommonModule, FormsModule, Step2Component],
  templateUrl: './create-annotation.component.html',
  styleUrl: './create-annotation.component.scss',
})
export default class CreateAnnotationComponent {
  currentStep: number = 1;
  step1Input: string = '';
  isValidVideoId: boolean = false;

  constructor(private http: HttpClient) {}

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  finish() {
    console.log('Wizard abgeschlossen!');
  }

  validateVideoId() {
    const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
    this.isValidVideoId = videoIdPattern.test(this.step1Input);
  }

  checkVideoExists() {
    const videoId = this.step1Input;
    const url = `/api/check-youtube-video?videoId=${videoId}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.items && response.items.length > 0) {
        this.isValidVideoId = true;
        this.nextStep();
      } else {
        this.isValidVideoId = false;
        alert('Das Video existiert nicht oder ist nicht abrufbar.');
      }
    });
  }
}
