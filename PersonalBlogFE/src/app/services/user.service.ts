import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../shared/blog-app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = environment.apiBaseUrl;
  userList: User[] = [];

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return headers
  }

  refreshUser() {
    const headers = this.getHeaders()

    return this.http.get(`${this.apiUrl}/User`, { headers })
      .subscribe({
        next: res => {
          this.userList = res as User[];
        },
        error: err => {
          console.error('Error fetching user data:', err);
        }
      })
  }

  addUser(formData: FormData): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post(`${this.apiUrl}/User`, formData, { headers });
  }

  getUser(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.get(`${this.apiUrl}/User/${id}`, { headers });
  }

  updateUser(id: string, formData: FormData): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put(`${this.apiUrl}/User/${id}`, formData, { headers });
  }

  deleteUser(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.delete(`${this.apiUrl}/User/${id}`, { headers });
  }
}
