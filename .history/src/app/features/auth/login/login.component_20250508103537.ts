import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    NgxMaskDirective
  ],
  providers: [MessageService, provideNgxMask()],
  template: `
    <div class="login-container">
      <div class="login-content">
        <div class="login-branding">
          <h1 class="brand-logo">AutoParts<span class="highlight">B2B</span></h1>
          <p class="brand-tagline">Your trusted source for automotive parts</p>
        </div>
        
        <p-card class="login-card">
          <h2>Sign In to Your Account</h2>
          <p class="welcome-text">Welcome back! Please enter your credentials to access your account.</p>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label for="email">Email</label>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-envelope"></i>
                <input 
                  id="email" 
                  type="email" 
                  pInputText 
                  class="w-full" 
                  placeholder="Enter your email"
                  formControlName="email"
                  [ngClass]="{'ng-invalid ng-dirty': isFieldInvalid('email')}"
                />
              </div>
              <small 
                class="p-error" 
                *ngIf="isFieldInvalid('email')"
              >
                Please enter a valid email address
              </small>
            </div>
            
            <div class="field">
              <div class="flex justify-content-between align-items-center">
                <label for="password">Password</label>
                <a 
                  href="javascript:void(0)" 
                  class="forgot-password"
                  (click)="showForgotPasswordDialog()"
                >
                  Forgot password?
                </a>
              </div>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-lock"></i>
                <input 
                  id="password" 
                  type="password" 
                  pPassword 
                  [feedback]="false" 
                  class="w-full" 
                  placeholder="Enter your password"
                  formControlName="password"
                  [ngClass]="{'ng-invalid ng-dirty': isFieldInvalid('password')}"
                />
              </div>
              <small 
                class="p-error" 
                *ngIf="isFieldInvalid('password')"
              >
                Password is required
              </small>
            </div>
            
            <div class="field-checkbox">
              <p-checkbox 
                inputId="rememberMe" 
                formControlName="rememberMe" 
                [binary]="true"
              ></p-checkbox>
              <label for="rememberMe">Remember me</label>
            </div>
            
            <button 
              pButton 
              type="submit" 
              class="p-button-primary w-full" 
              [disabled]="loginForm.invalid || isLoading"
            >
              <i class="pi pi-spin pi-spinner" *ngIf="isLoading"></i>
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>
          
          <div class="business-info">
            <p>Not registered yet?</p>
            <p>Contact our business team at <a href="mailto:sales@autopartsb2b.com">sales@autopartsb2b.com</a> to create your business account</p>
          </div>
        </p-card>
      </div>
    </div>
    
    <p-dialog 
      header="Reset Password" 
      [(visible)]="forgotPasswordVisible" 
      [modal]="true" 
      [draggable]="false" 
      [resizable]="false"
      class="forgot-password-dialog"
      [style]="{width: '450px'}"
    >
      <form [formGroup]="forgotPasswordForm" (ngSubmit)="onForgotPasswordSubmit()">
        <div class="field">
          <label for="resetEmail">Email</label>
          <div class="p-input-icon-left w-full">
            <i class="pi pi-envelope"></i>
            <input 
              id="resetEmail" 
              type="email" 
              pInputText 
              class="w-full" 
              placeholder="Enter your email"
              formControlName="email"
              [ngClass]="{'ng-invalid ng-dirty': isFieldInvalid('email', forgotPasswordForm)}"
            />
          </div>
          <small 
            class="p-error" 
            *ngIf="isFieldInvalid('email', forgotPasswordForm)"
          >
            Please enter a valid email address
          </small>
        </div>
        
        <div class="dialog-actions">
          <button 
            pButton 
            type="button" 
            label="Cancel" 
            class="p-button-text" 
            (click)="forgotPasswordVisible = false"
            [disabled]="isResetting"
          ></button>
          <button 
            pButton 
            type="submit" 
            label="Reset Password" 
            [disabled]="forgotPasswordForm.invalid || isResetting"
          >
            <i class="pi pi-spin pi-spinner" *ngIf="isResetting"></i>
            <span>{{ isResetting ? 'Sending...' : 'Reset Password' }}</span>
          </button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-md);
    }
    
    .login-content {
      max-width: 480px;
      width: 100%;
    }
    
    .login-branding {
      text-align: center;
      margin-bottom: var(--spacing-md);
      color: white;
    }
    
    .brand-logo {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
      letter-spacing: 0.5px;
    }
    
    .highlight {
      color: var(--accent-light);
    }
    
    .brand-tagline {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
    
    .login-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .login-card ::ng-deep .p-card-body {
      padding: var(--spacing-lg);
    }
    
    h2 {
      text-align: center;
      margin-top: 0;
      margin-bottom: var(--spacing-xs);
      color: var(--neutral-900);
    }
    
    .welcome-text {
      text-align: center;
      color: var(--neutral-600);
      margin-bottom: var(--spacing-lg);
    }
    
    .field {
      margin-bottom: var(--spacing-md);
    }
    
    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
      color: var(--neutral-800);
    }
    
    .p-input-icon-left {
      width: 100%;
    }
    
    .field-checkbox {
      margin-bottom: var(--spacing-md);
      display: flex;
      align-items: center;
    }
    
    .field-checkbox label {
      margin-bottom: 0;
      margin-left: var(--spacing-xs);
      color: var(--neutral-700);
    }
    
    .forgot-password {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }
    
    .forgot-password:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
    
    button.p-button {
      margin-bottom: var(--spacing-md);
    }
    
    .business-info {
      text-align: center;
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--neutral-200);
    }
    
    .business-info p {
      margin: var(--spacing-xs) 0;
    }
    
    .business-info a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .business-info a:hover {
      text-decoration: underline;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-lg);
    }
    
    @media screen and (max-width: 480px) {
      .login-content {
        width: 100%;
      }
      
      .login-card ::ng-deep .p-card-body {
        padding: var(--spacing-md);
      }
    }
    
    /* Animation */
    .login-branding, .login-card {
      animation: fadeIn 0.6s ease-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoading = false;
  isResetting = false;
  forgotPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['demo@autoparts.com', [Validators.required, Validators.email]],
      password: ['password', Validators.required],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/search']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password. Please try again.'
          });
        }
      });
  }

  showForgotPasswordDialog(): void {
    this.forgotPasswordVisible = true;
    this.forgotPasswordForm.reset();
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isResetting = true;
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email)
      .pipe(finalize(() => this.isResetting = false))
      .subscribe({
        next: () => {
          this.forgotPasswordVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Email Sent',
            detail: 'Password reset instructions have been sent to your email.'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Request Failed',
            detail: 'Could not process your request. Please try again later.'
          });
        }
      });
  }

  isFieldInvalid(field: string, form: FormGroup = this.loginForm): boolean {
    return form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched);
  }
}