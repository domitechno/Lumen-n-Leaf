import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Books } from '../models/book.model';
import { Subscription } from 'rxjs';
import { FavorisService } from '../services/favoris.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  standalone: true,
  styleUrls: ['./booklist.component.css'],
  imports: [CommonModule]
})

export class BookListComponent implements OnInit, OnDestroy {
   @Input() books: Books[] = [];
  userId: string = '';
  private updateSub!: Subscription;

  constructor(
    private collectionService: CollectionService,
    private favorisService: FavorisService,
    private authService: AuthService 
  ) {}

ngOnInit() {
  this.userId = this.authService.getUserId() ?? '';
  if (this.userId) {
    this.loadCollection();
    this.updateSub = this.collectionService.getCollectionUpdatedListener()
      .subscribe(() => {
        this.loadCollection();
      });
  } else {
    console.warn('Aucun userId trouvé !');
  }
}
    
  loadCollection() {
    if (!this.userId) return;
    this.collectionService.getUserCollection(this.userId).subscribe({
      next: data => this.books = data,
      error: err => console.error(err)
    });
  }

  getCoverSrc(cover_url: string): string {
  if (!cover_url) return 'assets/default-cover.png';
  if (cover_url.startsWith('/uploads/')) return 'http://localhost:3000' + cover_url;
  if (cover_url.startsWith('assets/')) return cover_url;
  // Cas où c'est juste le nom de fichier
  return 'http://localhost:3000/uploads/' + cover_url;
}

addToFavoris(bookId: number) {
  const userId = this.authService.getUserId();
  if (!userId) {
    alert("Utilisateur non identifié");
    return;
  }
  this.favorisService.addToFavoris(userId, bookId).subscribe({
    next: () => alert('Ajouté aux favoris !'),
    error: (err) => alert(err.error?.message || 'Erreur')
  });
}

  ngOnDestroy() {
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }

  onImgError(event: any) {
  event.target.src = 'assets/default-cover.png';
}

}
