import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatInputModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerFormGroup = this.formBuilder.group({
  username: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  password: ['', [Validators.required]],
  role: ['reader']
});


  registrationError = '';

  register() {
  if (this.registerFormGroup.valid) {
    const { username, email, firstName, lastName, password, role } = this.registerFormGroup.value;
    this.authService.register(
      username!,
      email!,
      firstName!,
      lastName!,
      password!,
      role!
    ).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.registrationError = err.error?.error || "Erreur lors de l'inscription";
      }
    });
  }
}
}

