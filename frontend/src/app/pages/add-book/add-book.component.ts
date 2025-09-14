import { Component, OnInit } from '@angular/core';
import { Books } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatIconModule
  ]
})

export class AddBookComponent implements OnInit {
  book: Books = new Books();
  genres: any[] = [];
  categories: any[] = [];

  constructor(
  private bookService: BookService,
  private http: HttpClient,
  private router: Router
) {}


  ngOnInit() {
    this.http.get<any[]>('/api/genre').subscribe(data => this.genres = data);
    this.http.get<any[]>('/api/category').subscribe(data => this.categories = data);
  }

onGenreChange(genreId: number) {
  const genre = this.genres.find(g => g.id === +genreId);
  this.book.genre_id = genre?.id;             
  this.book.genre_name = genre?.name || '';   
  this.book.genre_image = genre?.image_url || ''; 
}

onCategoryChange(categoryId: number) {
  const cat = this.categories.find(c => c.id === +categoryId);
  this.book.category_id = cat?.id;             
  this.book.category_name = cat?.name || '';
  this.book.category_color = cat?.color || '';
}

onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('cover', file);

      this.http.post<{ url: string }>('/api/uploads', formData).subscribe({
        next: res => {
          this.book.cover_url = res.url;
        },
        error: err => alert("Erreur lors de l'upload de la couverture")
      });
    }
  }

  onSubmit() {
    this.bookService.addBook(this.book).subscribe({
      next: res => {
        alert('Livre ajouté avec succès !');
        this.book = new Books();
         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/canvas']);
      });
      },
      error: err => {
        alert('Erreur lors de l\'ajout');
      }
    });
  }
}