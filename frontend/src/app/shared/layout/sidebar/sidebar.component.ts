import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="sidebar-container glass-panel">
      <div class="logo">
        <div class="typographic-logo">
          <strong>Reded</strong>Dotcom
        </div>
      </div>
      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" *ngIf="role !== 'Worker'">
          <i class="icon-dashboard"></i> Dashboard
        </a>
        <a routerLink="/orders" routerLinkActive="active" class="nav-item" *ngIf="role !== 'Worker'">
          <i class="icon-orders"></i> Orders
        </a>
        <a routerLink="/workers" routerLinkActive="active" class="nav-item" *ngIf="role !== 'Worker'">
          <i class="icon-workers"></i> Workforce
        </a>
        <a routerLink="/my-work" routerLinkActive="active" class="nav-item">
          <i class="icon-worker-board"></i> My Work
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      border-radius: 0;
      border-top: none;
      border-bottom: none;
      border-left: none;
      display: flex;
      flex-direction: column;
      padding: 32px 16px;
      background: var(--bg-primary);
    }
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 48px;
      padding: 0 12px;
    }
    .typographic-logo {
      font-size: 22px;
      font-weight: 400;
      letter-spacing: -0.5px;
      color: var(--text-primary);
    }
    .typographic-logo strong {
      font-weight: 700;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--border-radius-sm);
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    .nav-item:hover {
      background: var(--border-color);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--text-primary);
      color: var(--bg-secondary);
      box-shadow: none;
    }
  `]
})
export class SidebarComponent {
  role: string | null = null;
  
  constructor(private auth: AuthService) {
    this.auth.userRole$.subscribe(r => this.role = r);
  }
}
