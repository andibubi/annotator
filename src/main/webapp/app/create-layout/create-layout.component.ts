import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router'; // Importiere den Router
import PlayerComponent from '../player/player.component';
import { VideoIdDialogComponent } from '../video-id-dialog/video-id-dialog.component';
import { ExtendedLayoutService } from '../entities/layout/service/extended-layout.service';
import { ILayout } from '../entities/layout/layout.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-create-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerComponent, VideoIdDialogComponent],
  templateUrl: './create-layout.component.html',
  styleUrl: './create-layout.component.scss',
})
export default class CreateLayoutComponent {
  layout: ILayout | null = null;

  constructor(
    private http: HttpClient,
    private layoutService: ExtendedLayoutService,
    private router: Router, // Füge den Router hinzu
  ) {}

  handleVideoId(videoId: string) {
    this.subscribeToSaveResponse(this.layoutService.create(videoId, { id: null }));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ILayout>>): void {
    result.subscribe(
      (res: HttpResponse<ILayout>) => this.onSaveSuccess(res),
      (res: HttpResponse<any>) => this.onSaveError(),
    );
  }

  private onSaveSuccess(response: HttpResponse<ILayout>): void {
    this.layout = response.body;
    console.log('Entity successfully created', response.body);

    if (this.layout && this.layout.id) {
      // Navigiere zu /play/{layoutId}
      this.router.navigate(['/play', this.layout.id]);
    }
  }

  private onSaveError(): void {
    console.error('There was an error creating the entity');
  }
}
