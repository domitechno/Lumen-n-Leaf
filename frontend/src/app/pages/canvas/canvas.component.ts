import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { CollectionService } from '../../services/collection.service';
import { CommonModule } from '@angular/common';
import { BookListComponent } from '../../booklist/booklist.component';
import { Books } from '../../models/book.model';
import { Category } from '../../models/category.model';
import { Genre } from '../../models/genre.model';
import { CategoryService } from '../../services/category.service';
import { GenreService } from '../../services/genre.service';
import { FormsModule } from '@angular/forms';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
   standalone: true,
  imports: [CommonModule, 
    BookListComponent,
    FormsModule
  ],
})

export class CanvasComponent implements OnInit {
  @ViewChild(BookListComponent) bookListComponent!: BookListComponent;
  userRole: string | null = null;
  userId: string | null = null;
  books: Books[] = [];
  categories: Category[] = [];
  genres: Genre[] = [];
  selectedCategory: Category | null = null;
  selectedGenre: Genre | null = null;
  favorisBooks: Books[] = [];



   activePanel: 'collection' | 'category' | 'genre' | 'favoris' = 'collection';
   searchTerm: string = '';
   avatarUrl: string = 'assets/img/default-avatar.png';
   collectionTitle: string = 'Ma collection'; // Valeur initiale
    isEditingTitle = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private collectionService: CollectionService,
     private categoryService: CategoryService,
    private genreService: GenreService,
    private favorisService: FavorisService,
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getRole();
    this.userId = this.authService.getUserId();
    this.avatarUrl = this.authService.getAvatarUrl() || 'assets/img/default-avatar.png';
    this.loadCollection();
     this.loadCategories();
    this.loadGenres();
  }

  goToProfile() {
  this.router.navigate(['/profile']);
}

   editTitle() {
    this.isEditingTitle = true;
  }

  saveTitle() {
    this.isEditingTitle = false;
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }
 selectCategory(cat: Category) {
    this.selectedCategory = cat;
 }

  loadGenres() {
    this.genreService.getAllGenres().subscribe({
      next: (data) => this.genres = data,
      error: (err) => console.error(err)
    });
  }

  selectGenre(genre: Genre) {
  this.selectedGenre = genre;
    this.activePanel = 'genre';
}

loadCollection() {
  if (this.userId) {
    this.collectionService.getUserCollection(this.userId).subscribe({
      next: (data) => {
        this.books = data;
        console.log('Livres dans la collection:', this.books); // <-- Ici !
      },
      error: (err) => console.error(err)
    });
  }
}


  onNewStoryClick() {
  if (this.userRole === 'author') {
    this.router.navigate(['/add-book']);
  } else {
    alert("Seuls les auteurs peuvent ajouter une nouvelle histoire");
  }
}

  onAddBookToCollection() {
  if (!this.userId) {
    alert("Utilisateur non identifié");
    return;
  }

  if (this.userRole !== 'reader') {
    alert("Seuls les lecteurs peuvent ajouter un livre aléatoire à leur collection");
    return;
  }

  this.collectionService.addRandomBookToCollection(this.userId).subscribe({
    next: (book) => {
      alert(`Livre ajouté : ${book.title}`);
      this.bookListComponent.loadCollection();
    },
    error: (err) => alert(err.error?.error || 'Erreur lors de l’ajout')
  });
}

  onImgError(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/default-cover.png';
}

onFavoritesClick() {
  this.activePanel = 'favoris';
  const userId = this.authService.getUserId();
  if (!userId) {
    alert('Utilisateur non identifié');
    return;
  }
  this.favorisService.getUserFavoris(userId).subscribe({
    next: data => this.favorisBooks = data as Books[],
    error: err => console.error(err)
  });
}


logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}

get filteredBooks(): Books[] {
  let result = this.books;

  // Si une catégorie est sélectionnée
  if (this.activePanel === 'category' && this.selectedCategory) {
    result = result.filter(book => book.category_id == this.selectedCategory!.id);
  }

  // Pareil pour le genre…
  if (this.activePanel === 'genre' && this.selectedGenre) {
    result = result.filter(book => book.genre_id == this.selectedGenre!.id);
  }

  // Filtrage par barre de recherche
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();
    result = result.filter(book => book.title.toLowerCase().includes(term));
  }

  return result;
}

}