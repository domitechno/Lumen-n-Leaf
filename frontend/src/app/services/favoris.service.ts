import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private apiUrl = 'http://localhost:3000/api/favoris';

  constructor(private http: HttpClient) {}

  addToFavoris(user_id: string, book_id: number) {
    return this.http.post(`${this.apiUrl}/add`, { user_id, book_id });
  }

  getUserFavoris(user_id: string) {
    return this.http.get(`${this.apiUrl}/user/${user_id}`);
  }
}
