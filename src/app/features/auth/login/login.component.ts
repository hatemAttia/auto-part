import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { AuthService } from "../../../core/services/auth.service";
import { finalize } from "rxjs/operators";
import { DialogModule } from "primeng/dialog";
import { provideNgxMask, NgxMaskDirective } from "ngx-mask";

@Component({
  selector: "app-login",
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
  ],
  providers: [MessageService, provideNgxMask()],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
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
      email: ["demo@autoparts.com", [Validators.required, Validators.email]],
      password: ["password", Validators.required],
      rememberMe: [false],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    this.isLoading = true;
    this.authService
      .login(email, password, rememberMe)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(["/private/home"]);
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Login Failed",
            detail: "Invalid email or password. Please try again.",
          });
        },
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

    this.authService
      .forgotPassword(email)
      .pipe(finalize(() => (this.isResetting = false)))
      .subscribe({
        next: () => {
          this.forgotPasswordVisible = false;
          this.messageService.add({
            severity: "success",
            summary: "Email Sent",
            detail: "Password reset instructions have been sent to your email.",
          });
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Request Failed",
            detail: "Could not process your request. Please try again later.",
          });
        },
      });
  }

  isFieldInvalid(field: string, form: FormGroup = this.loginForm): boolean {
    return form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched);
  }
}
