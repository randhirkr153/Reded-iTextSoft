import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private userRole = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRole.asObservable();

  private userName = new BehaviorSubject<string | null>(null);
  userName$ = this.userName.asObservable();
  
  constructor(private api: ApiService) {
    // Check if token exists on load
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (localStorage.getItem('token')) {
      this.loggedIn.next(true);
      if (role) this.userRole.next(role);
      if (name) this.userName.next(name);
    }
  }

  login(credentials: any) {
    return this.api.post('/auth/login', credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          if (res.role) {
            localStorage.setItem('role', res.role);
            this.userRole.next(res.role);
          }
          if (res.name) {
            localStorage.setItem('name', res.name);
            this.userName.next(res.name);
          }
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.userName.next(null);
  }
}
