import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'Customer';
  acceptTerms: boolean = false;
  passwordsMatch: boolean = true;
  passwordRequirements: any = {
    length: false,
    uppercase: false,
    special: false,
    number: false,
  };
  showPasswordRequirements: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private authService: AuthService) { }

  checkPasswords() {
    this.passwordsMatch = this.password === this.confirmPassword;
  }

  validatePassword() {
    this.showPasswordRequirements = this.password.length > 0;
    this.passwordRequirements.length = this.password.length >= 6;
    this.passwordRequirements.uppercase = /[A-Z]/.test(this.password);
    this.passwordRequirements.special = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    this.passwordRequirements.number = /[0-9]/.test(this.password);
  }

  isUsernameValid(): boolean {
    return this.username.length > 0;
  }

  isEmailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(this.email);
  }

  register() {
    this.validatePassword();
    this.checkPasswords();

    if (!this.isUsernameValid()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username is required' });
      return;
    }

    if (!this.isEmailValid()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email address' });
      return;
    }

    if (!this.passwordsMatch) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
      return;
    }

    if (!this.acceptTerms) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You must accept the terms and conditions' });
      return;
    }

    if (!this.passwordRequirements.length || !this.passwordRequirements.uppercase || !this.passwordRequirements.special || !this.passwordRequirements.number) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password does not meet the requirements' });
      return;
    }

    this.authService.register(this.username, this.email, this.password, this.role).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully' });
        this.router.navigate(['/login']);
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed' });
      }
    );
  }
}
