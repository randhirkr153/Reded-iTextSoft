import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-worker-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portal-container">
      <div class="header">
        <h2>My Factory Workstation</h2>
      </div>

      <div class="task-card glass-panel" *ngIf="myTask && myTask.orders; else noTask">
        <div class="assigned-badge">Currently Assigned</div>
        <h1 class="task-name">{{ myTask.orders.name }}</h1>
        <div class="status-chip">{{ myTask.orders.status }}</div>

        <div class="progress-section">
          <div class="progress-info">
            <span>Production Progress</span>
            <span class="pct">{{ myTask.orders.progress }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" [style.width]="myTask.orders.progress + '%'"></div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-increment" (click)="updateProgress(25)" [disabled]="myTask.orders.progress >= 100">
            Log +25% Processed
          </button>
          
          <button class="btn-complete" (click)="updateProgress(100)" [disabled]="myTask.orders.progress >= 100">
            Mark Entire Batch Fully Complete
          </button>
        </div>
      </div>

      <ng-template #noTask>
        <div class="empty-state glass-panel">
          <i class="icon-coffee" style="font-size: 48px; display: block; margin-bottom: 16px;">☕</i>
          <h3>No Orders Assigned</h3>
          <p>You are currently on active standby. Please wait for the Manager to dispatch a batch to your workstation via the Workforce portal.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .portal-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header h2 {
      font-size: 28px;
      color: var(--text-primary);
      margin-bottom: 30px;
    }
    .task-card {
      padding: 40px;
      text-align: center;
      border: 2px solid var(--accent-primary);
      box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
    }
    .assigned-badge {
      display: inline-block;
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent-primary);
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .task-name {
      font-size: 42px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }
    .status-chip {
      display: inline-block;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 8px 24px;
      border-radius: 8px;
      font-size: 18px;
      margin-bottom: 40px;
      color: var(--text-secondary);
    }
    .progress-section {
      text-align: left;
      margin-bottom: 40px;
    }
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 18px;
      color: var(--text-secondary);
    }
    .pct {
      color: var(--text-primary);
      font-weight: bold;
      font-size: 24px;
    }
    .progress-track {
      height: 16px;
      background: var(--bg-primary);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .progress-fill {
      height: 100%;
      background: var(--accent-primary);
      border-radius: 8px;
      transition: width 0.4s ease;
    }
    .action-buttons {
      display: flex;
      gap: 20px;
    }
    .action-buttons button {
      flex: 1;
      padding: 20px;
      font-size: 18px;
      border-radius: var(--border-radius-md);
      border: none;
      font-weight: 600;
      color: white;
    }
    .btn-increment {
      background: var(--bg-secondary);
      border: 1px solid var(--accent-primary) !important;
      color: var(--accent-primary) !important;
    }
    .btn-increment:hover:not(:disabled) {
      background: rgba(59,130,246,0.1);
    }
    .btn-complete {
      background: var(--accent-success);
    }
    .btn-complete:hover:not(:disabled) {
      background: #059669;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .empty-state {
      padding: 60px;
      text-align: center;
      border: 2px dashed var(--border-color);
    }
    .empty-state p {
      color: var(--text-secondary);
      font-size: 18px;
      max-width: 400px;
      margin: 10px auto;
    }
  `]
})
export class WorkerPortalComponent implements OnInit {
  myTask: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchTask();
  }

  fetchTask() {
    this.api.get('/workers/me/task').subscribe({
      next: (data) => this.myTask = data,
      error: (err) => console.error(err)
    });
  }

  updateProgress(incrementAmount: number) {
    if (!this.myTask || !this.myTask.orders) return;
    
    let newProgress = this.myTask.orders.progress + incrementAmount;
    if (newProgress > 100) newProgress = 100;
    
    // If increment is exactly 100 (complete button), force it to 100
    if (incrementAmount === 100) newProgress = 100;

    this.api.put('/workers/me/task/progress', { progress: newProgress }).subscribe({
      next: () => this.fetchTask(),
      error: (err) => alert(err.message)
    });
  }
}
