import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        const userRole = this.authService.getUserRole();
        if (userRole === 'Customer') {
          this.router.navigate(['/catalog']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid username or password' });
      }
    );
  }
}
