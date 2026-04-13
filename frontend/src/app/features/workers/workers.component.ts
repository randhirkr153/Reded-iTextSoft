import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header-section">
      <h2>Workforce Management</h2>
      <button class="btn-primary" (click)="addWorker()">+ Add Worker</button>
    </div>

    <div class="table-container glass-panel">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Assigned Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let worker of workers">
            <td>
              <div class="user-cell">
                <div class="avatar-small">{{ worker.name.charAt(0) }}</div>
                <span>{{ worker.name }}</span>
              </div>
            </td>
            <td><span class="role-badge">{{ worker.role }}</span></td>
            <td>
              <span class="status-indicator" [class]="worker.status">
                {{ worker.status }}
              </span>
            </td>
            <td>
              <span *ngIf="worker.orders" class="assigned-task">
                {{ worker.orders.name }} ({{ worker.orders.status }})
              </span>
              <span *ngIf="!worker.orders" class="text-muted">Unassigned</span>
            </td>
            <td>
              <button class="btn-action" style="margin-right: 8px;" (click)="editWorker(worker)">Edit Details</button>
              <button class="btn-action" (click)="promptAssignTask(worker)">Assign Task</button>
            </td>
          </tr>
          <tr *ngIf="workers.length === 0">
            <td colspan="5" class="empty-state">No workers found in the database.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .btn-primary {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: var(--border-radius-sm);
      font-weight: 600;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      padding: 16px;
      color: var(--text-secondary);
      font-weight: 500;
      border-bottom: 1px solid var(--border-color);
      font-size: 14px;
    }
    .data-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
      font-size: 14px;
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }
    .avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }
    .role-badge {
      background: var(--border-color);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      color: var(--text-primary);
    }
    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .status-indicator::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: gray;
    }
    .status-indicator.Active::before { background: var(--accent-success); }
    .status-indicator.Busy::before { background: var(--accent-warning); }
    .status-indicator.On::before { background: var(--accent-danger); } /* On Leave */
    
    .assigned-task {
      color: var(--accent-primary);
    }
    .text-muted {
      color: var(--text-secondary);
      font-style: italic;
    }
    .btn-action {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 6px 12px;
      border-radius: 4px;
    }
    .btn-action:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .empty-state {
      text-align: center;
      color: var(--text-secondary);
      padding: 32px;
    }
  `]
})
export class WorkersComponent implements OnInit {
  workers: any[] = [];
  availableOrders: any[] = []; // Used to show dropdown in a real modal

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadWorkers();
    
    // Also load orders so we know what they can be assigned to!
    this.api.get('/orders').subscribe(data => {
      this.availableOrders = data.filter((o: any) => o.status !== 'Finished');
    });
  }

  loadWorkers() {
    this.api.get('/workers').subscribe({
      next: (data) => this.workers = data,
      error: (err) => console.error(err)
    });
  }

  editWorker(worker: any) {
    const newName = prompt("Edit Worker's Full Name:", worker.name);
    const newRole = prompt("Edit Factory Role:", worker.role);
    
    if (newName && newRole) {
      this.api.put(`/workers/${worker.id}`, { name: newName, role: newRole }).subscribe({
        next: () => this.loadWorkers(),
        error: (err) => alert("Failed to update worker: " + err.message)
      });
    }
  }

  addWorker() {
    const name = prompt("Enter new worker's FULL NAME:");
    const email = prompt("Enter login EMAIL for this worker:");
    const password = prompt("Enter a starting PASSWORD (e.g. worker123):");
    const role = prompt("Enter factory role (e.g. Spinner, Dyer):");
    
    if (name && email && password && role) {
      this.api.post('/workers', { name, email, password, role }).subscribe({
        next: () => this.loadWorkers(),
        error: (err) => alert("Failed to add worker: " + err.message)
      });
    } else {
      alert("All fields are required to create an authenticated worker!");
    }
  }

  promptAssignTask(worker: any) {
    if (this.availableOrders.length === 0) {
      alert("There are no active orders to assign!");
      return;
    }
    
    // Simple prompt implementation. In production, this would be a select dropdown modal!
    let promptText = "Type the number of the Order ID to assign:\n\n";
    this.availableOrders.forEach((o, index) => {
      promptText += `${index + 1}. [${o.status}] ${o.name}\n`;
    });
    promptText += "0. Unassign current task\n";

    const answer = prompt(promptText);
    
    if (answer) {
      const idx = parseInt(answer) - 1;
      let assigned_task_id = null;
      
      if (idx >= 0 && idx < this.availableOrders.length) {
        assigned_task_id = this.availableOrders[idx].id;
      }

      this.api.put(`/workers/${worker.id}/assign`, { assigned_task_id }).subscribe(() => {
        this.loadWorkers();
      });
    }
  }
}
