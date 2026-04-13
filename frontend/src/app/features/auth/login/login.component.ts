import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box glass-panel">
        <div class="logo">
          <h2 style="font-size: 28px; line-height: 1.2; letter-spacing: normal;">Reded iTextSoft<br><span style="font-size: 16px; font-weight: 500; color: var(--text-secondary);">Solution</span></h2>
        </div>
        <h3>Welcome Back</h3>
        <p class="subtitle">Enter your credentials to access the portal.</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" class="form-control" placeholder="admin@tpms.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
          </div>
          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
          <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
    }
    .login-box {
      width: 100%;
      max-width: 440px;
      padding: 48px;
      text-align: center;
      background: var(--bg-secondary);
    }
    .logo-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      background: var(--text-primary);
      border-radius: 12px;
      position: relative;
    }
    .logo-icon::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background: var(--bg-secondary);
      border-radius: 50%;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    .logo-text {
      color: var(--text-primary);
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 2px;
    }
    .logo-subtext {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 40px;
      font-weight: 500;
    }
    h3 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 32px;
      font-size: 15px;
    }
    .form-group {
      text-align: left;
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }
    .form-control {
      width: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 14px 16px;
      border-radius: var(--border-radius-md);
      font-size: 15px;
      outline: none;
      transition: all var(--transition-fast);
    }
    .form-control:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
    }
    .submit-btn {
      width: 100%;
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 14px;
      border-radius: var(--border-radius-sm);
      font-size: 16px;
      font-weight: 600;
      margin-top: 16px;
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .error-msg {
      color: var(--accent-danger);
      font-size: 14px;
      margin-top: 8px;
      text-align: left;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        // Find role from service since res here in component subscription usually has it 
        // because we passed it from tap. Actually tap absorbs it. So we rely on localStorage.
        const role = localStorage.getItem('role');
        if (role === 'Worker') {
          this.router.navigate(['/my-work']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
