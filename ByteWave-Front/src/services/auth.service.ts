import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.loggedIn.next(true);
      const tokenPayload: any = jwtDecode(token);
      this.userSubject.next(tokenPayload);
      sessionStorage.setItem('userId', tokenPayload['nameid']);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('https://localhost:5200/api/auth/login', { username, password }).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token);
        const tokenPayload: any = jwtDecode(response.token);
        sessionStorage.setItem('role', tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '');
        sessionStorage.setItem('userId', tokenPayload['nameid']);
        this.loggedIn.next(true);
        this.userSubject.next(tokenPayload);
      })
    );
  }

  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post('https://localhost:5200/api/auth/register', { username, email, password, role });
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    this.loggedIn.next(false);
    this.userSubject.next(null);
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null;
    }
    return null;
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  getUserObservable(): Observable<any> {
    return this.userSubject.asObservable();
  }
}
