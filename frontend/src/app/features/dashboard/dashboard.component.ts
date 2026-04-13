import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-header">
      <h2>Dashboard Overview</h2>
      <button class="action-btn">Generate Report</button>
    </div>

    <div class="stats-grid" *ngIf="stats">
      <div class="stat-card glass-panel" style="--accent: var(--accent-primary)">
        <div class="stat-icon"><i class="icon-orders"></i></div>
        <div class="stat-info">
          <h3>Total Orders</h3>
          <div class="value">{{ stats.totalOrders }}</div>
        </div>
      </div>
      <div class="stat-card glass-panel" style="--accent: var(--accent-secondary)">
        <div class="stat-icon"><i class="icon-active"></i></div>
        <div class="stat-info">
          <h3>Active Orders</h3>
          <div class="value">{{ stats.activeOrders }}</div>
        </div>
      </div>
      <div class="stat-card glass-panel" style="--accent: var(--accent-warning)">
        <div class="stat-icon"><i class="icon-delayed"></i></div>
        <div class="stat-info">
          <h3>Delayed Orders</h3>
          <div class="value">{{ stats.delayedOrders }}</div>
        </div>
      </div>
      <div class="stat-card glass-panel" style="--accent: var(--accent-success)">
        <div class="stat-icon"><i class="icon-workers"></i></div>
        <div class="stat-info">
          <h3>Active Workers</h3>
          <div class="value">{{ stats.totalWorkers }}</div>
        </div>
      </div>
    </div>

    <div class="recent-activity-placeholder glass-panel">
      <h3>Production Progress</h3>
      <div class="progress-bar-container">
        <div class="progress-label">
          <span>Order #1024 - Spinning</span>
          <span>45%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 45%; background: var(--accent-primary)"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .action-btn {
      background: var(--bg-glass);
      color: var(--accent-primary);
      border: 1px solid var(--accent-primary);
      padding: 10px 20px;
      border-radius: var(--border-radius-sm);
      font-weight: 500;
    }
    .action-btn:hover {
      background: var(--accent-primary);
      color: var(--bg-secondary);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-left: 4px solid var(--accent);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-info h3 {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-weight: 500;
    }
    .value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .recent-activity-placeholder {
      padding: 24px;
    }
    .progress-bar-container {
      margin-top: 24px;
    }
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .progress-track {
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = { totalOrders: 0, activeOrders: 0, delayedOrders: 0, totalWorkers: 0, activeMachines: 0 };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get('/dashboard').subscribe({
      next: (res) => this.stats = res,
      error: (err) => console.error(err)
    });
  }
}
