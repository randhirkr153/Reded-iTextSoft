import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-header">
      <h2>Production Orders</h2>
      <button class="btn-primary" (click)="openNewOrderModal()">+ New Order</button>
    </div>

    <!-- Kanban Board -->
    <div class="kanban-board">
      <div class="kanban-column glass-panel" *ngFor="let stage of stages">
        <div class="column-header">
          <h3>{{ stage }}</h3>
          <span class="badge">{{ getOrdersByStage(stage).length }}</span>
        </div>
        
        <div class="kanban-cards">
          <div class="order-card" *ngFor="let order of getOrdersByStage(stage)">
            <div class="card-header">
              <span class="order-name">{{ order.name }}</span>
              <span class="progress-badge">{{ order.progress }}%</span>
            </div>
            
            <div class="card-body">
              <div class="detail">
                <i class="icon-calendar"></i> {{ order.deadline | date:'shortDate' }}
              </div>
              
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width]="order.progress + '%'"></div>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button class="btn-small" (click)="advanceOrder(order)" *ngIf="stage !== 'Finished'">Advance</button>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="getOrdersByStage(stage).length === 0">
            No orders in this stage
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-header {
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
    .btn-primary:hover {
      background: #2563EB;
    }
    .btn-small {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      width: 100%;
    }
    .btn-small:hover {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
    }
    
    .kanban-board {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      padding-bottom: 20px;
      min-height: 600px;
    }
    .kanban-column {
      flex: 0 0 320px;
      display: flex;
      flex-direction: column;
      border-top: 4px solid var(--accent-primary);
    }
    .kanban-column:nth-child(2) { border-top-color: var(--accent-warning); }
    .kanban-column:nth-child(3) { border-top-color: var(--accent-secondary); }
    .kanban-column:nth-child(4) { border-top-color: #EC4899; }
    .kanban-column:nth-child(5) { border-top-color: var(--accent-success); }
    
    .column-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }
    .column-header h3 {
      font-size: 16px;
      font-weight: 600;
    }
    .badge {
      background: rgba(255,255,255,0.1);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    .kanban-cards {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-grow: 1;
    }
    .order-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: 16px;
      transition: transform 0.2s;
      cursor: grab;
    }
    .order-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px var(--border-color);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .order-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    .progress-badge {
      font-size: 11px;
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-success);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .card-body {
      margin-bottom: 16px;
    }
    .detail {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    .progress-container {
      width: 100%;
    }
    .progress-bar {
      height: 6px;
      background: var(--bg-secondary);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent-primary);
      border-radius: 3px;
    }
    .empty-state {
      text-align: center;
      padding: 20px 0;
      color: var(--text-secondary);
      font-size: 14px;
      font-style: italic;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  stages = ['Pending', 'Spinning', 'Weaving', 'Dyeing', 'Finished'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.api.get('/orders').subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error(err)
    });
  }

  getOrdersByStage(stage: string) {
    return this.orders.filter(o => o.status === stage);
  }

  openNewOrderModal() {
    // Basic implementation for now, naturally this would open a Dialog
    const name = prompt('Enter new order name (e.g. Silk Batch #292):');
    if (name) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30); // Default 30 days
      
      this.api.post('/orders', { name, deadline: deadline.toISOString() }).subscribe({
        next: () => this.loadOrders(),
        error: (err) => alert(err.message)
      });
    }
  }

  advanceOrder(order: any) {
    const currentIndex = this.stages.indexOf(order.status);
    if (currentIndex < this.stages.length - 1) {
      const nextStage = this.stages[currentIndex + 1];
      const newProgress = Math.min(order.progress + 25, 100);
      
      this.api.put(`/orders/${order.id}/progress`, {
        status: nextStage,
        progress: newProgress
      }).subscribe({
        next: () => this.loadOrders(),
        error: (err) => alert(err.message)
      });
    }
  }
}
