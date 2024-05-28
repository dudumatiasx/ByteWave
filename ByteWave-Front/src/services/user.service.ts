import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:5200/api/users';
  private authUrl = 'https://localhost:5200/api/auth/register';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    user.password = 'Default@123'; // Ensure default password
    return this.http.post<any>(this.authUrl, user);
  }

  updateUser(user: any): Observable<any> {
    const updatedUser = { ...user };
    delete updatedUser.password;
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, updatedUser);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  changePassword(userId: string, passwords: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/change-password`, passwords);
  }
}
