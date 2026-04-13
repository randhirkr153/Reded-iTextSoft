import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header glass-panel">
      <div class="header-content">
        <div class="search-bar">
          <input type="text" placeholder="Search orders, workers..." class="search-input">
        </div>
        <div class="user-profile">
          <div class="avatar">{{ name ? name.charAt(0).toUpperCase() : 'U' }}</div>
          <div class="user-info">
            <span class="name">{{ name || 'User' }}</span>
            <span class="role">{{ role || 'Factory Staff' }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      border-radius: 0;
      border-top: none;
      border-right: none;
      border-left: none;
      padding: 0 24px;
      display: flex;
      align-items: center;
      z-index: 5;
    }
    .header-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .search-input {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 10px 16px;
      border-radius: var(--border-radius-lg);
      width: 300px;
      outline: none;
      font-size: 14px;
      transition: border-color var(--transition-fast);
    }
    .search-input:focus {
      border-color: var(--accent-primary);
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      color: var(--text-primary);
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-weight: 600;
      font-size: 14px;
    }
    .role {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .logout-btn {
      margin-left: 16px;
      background: transparent;
      border: 1px solid var(--accent-danger);
      color: var(--accent-danger);
      padding: 6px 12px;
      border-radius: var(--border-radius-sm);
      font-weight: 600;
    }
    .logout-btn:hover {
      background: var(--accent-danger);
      color: white;
    }
  `]
})
export class HeaderComponent {
  name: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.userName$.subscribe(n => this.name = n);
    this.authService.userRole$.subscribe(r => this.role = r);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
