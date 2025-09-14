import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Books } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private apiUrl = 'http://localhost:3000/api/collection';
  private collectionUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getUserCollection(userId: string): Observable<Books[]> {
    return this.http.get<Books[]>(`${this.apiUrl}/user/${userId}`);
  }

  addBookToCollection(userId: string, bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { user_id: userId, book_id: bookId }).pipe(
      tap(() => this.collectionUpdated.next())
    );
  }

  addRandomBookToCollection(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-random`, { user_id: userId }).pipe(
      tap(() => this.collectionUpdated.next())
    );
  }

  // Ce getter permet à d'autres composants de s'abonner aux changements
  getCollectionUpdatedListener() {
    return this.collectionUpdated.asObservable();
  }
}
