import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  // Default Route (Redirects to /home)
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  // Standard Eager-Loaded Routes
  { 
    path: 'home', 
    component: HomeComponent,
    title: 'Home - My App' // Sets the browser tab title automatically
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component')
        .then(m => m.UsersComponent)
  },
  // Wildcard Route (Handles any undefined URL / 404 Page)
  { 
    path: '**', 
    component: NotFoundComponent,
    title: '404 - Page Not Found'
  }
];