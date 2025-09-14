import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- AJOUTE ÇA
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatButtonModule], // <-- AJOUTE RouterModule ici
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

}