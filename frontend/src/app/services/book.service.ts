import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Books } from '../models/book.model';
import { AuthService } from './auth.service'; // <-- À ajouter

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/book';

  // Ajoute AuthService au constructeur pour pouvoir récupérer l'id de l'auteur
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode unique pour ajouter un livre (auteur ou lecteur)
  addBook(bookData: any): Observable<any> {
    const dataWithAuthor = {
      ...bookData,
      author_id: this.authService.getUserId() // Ajoute automatiquement l'id de l'auteur connecté
    };
    return this.http.post(`${this.apiUrl}/add`, dataWithAuthor);
  }

  getBooks(): Observable<Books[]> {
    return this.http.get<Books[]>(this.apiUrl);
  }
}