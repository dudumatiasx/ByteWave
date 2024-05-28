import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  goBack() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else if (this.authService.getUserRole() === 'Customer') {
      this.router.navigate(['/catalog']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
