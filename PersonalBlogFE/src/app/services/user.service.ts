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

  refreshUser() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.post(`${this.apiUrl}/User`, formData, { headers });
  }
}
