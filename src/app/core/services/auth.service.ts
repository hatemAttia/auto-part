import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private isAuthenticatedValue = false;

  // Mock user for demo purposes
  private mockUser: User = {
    id: '1',
    email: 'demo@autoparts.com',
    firstName: 'Demo',
    lastName: 'User',
    company: 'AutoParts Inc.',
    role: 'Procurement'
  };

  constructor() {
    // Check if user is stored in localStorage (for "Remember me" functionality)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.isAuthenticatedValue = true;
    }
  }

  login(email: string, password: string, rememberMe: boolean): Observable<User> {
    // In a real app, this would be an HTTP request to a backend server
    return of(this.mockUser).pipe(
      delay(800), // Simulate network delay
      tap(user => {
        this.isAuthenticatedValue = true;
        this.currentUserSubject.next(user);
        
        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedValue = false;
  }

  forgotPassword(email: string): Observable<boolean> {
    // In a real app, this would call an API endpoint
    return of(true).pipe(delay(800));
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}