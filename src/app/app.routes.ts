import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'search', 
    loadComponent: () => import('./features/search/search-landing/search-landing.component').then(m => m.SearchLandingComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'part/:id', 
    loadComponent: () => import('./features/search/part-detail/part-detail.component').then(m => m.PartDetailComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart-page/cart-page.component').then(m => m.CartPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '/search'
  }
];