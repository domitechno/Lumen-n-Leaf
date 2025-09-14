import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.model';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiUrl = 'http://localhost:3000/api/genre';
  constructor(private http: HttpClient) {}

  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }
}
