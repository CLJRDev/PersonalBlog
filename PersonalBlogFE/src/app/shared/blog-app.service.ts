import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../shared/blog-app.model';

@Injectable({
  providedIn: 'root'
})
export class BlogAppService {
  apiUrl: string = environment.apiBaseUrl;
  userList: User[] = [];

  constructor(private http: HttpClient) { }

  refreshUser() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5fdXNlciIsImlzQWRtaW4iOiJUcnVlIiwiZXhwIjoxNzQ5OTI0Mzg4fQ.we54srxTJfMoS6ON9f8rbDgooIEJrBM_5XZz9cto0ZA';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.get(`${this.apiUrl}/User`, { headers })
      .subscribe({
        next: res => {
          console.log(res);
          this.userList = res as User[];
        },
        error: err => {
          console.error('Error fetching user data:', err);
        }
      })
  }
}
