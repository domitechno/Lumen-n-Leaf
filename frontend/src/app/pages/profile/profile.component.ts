import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => this.user = user,
      error: (err) => this.errorMessage = err.error?.error || 'Erreur lors de la récupération du profil'
    });
  }

    logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

    onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('avatar', file);

      this.authService.uploadAvatar(formData).subscribe({
        next: (data) => {
          this.user.avatar = data.avatar;
        },
        error: () => {
          alert("Erreur lors de l’upload");
        }
      });
    }
  }

  goBack() {
  this.location.back();
}

}