import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { CanvasComponent } from './pages/canvas/canvas.component';
import { AddBookComponent } from './pages/add-book/add-book.component';

export const routes: Routes = [{
	path: '',
	redirectTo: 'home',
	pathMatch: 'full'
},{
    path: 'home',
    component: HomeComponent 
  }, {
	path: 'register',
	component: RegisterComponent	
}, {
	path: 'login',
	component: LoginComponent
}, {
	path: 'canvas',
	component: CanvasComponent
}, {
  path: 'add-book',
  component: AddBookComponent
}, {
	path: 'profile', 
	component: ProfileComponent 
}];