import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Post } from '../shared/blog-app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl: string = environment.apiBaseUrl
  postList: Post[] = []

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return headers
  }

  refreshPost() {
    const headers = this.getHeaders()

    return this.http.get(`${this.apiUrl}/Post`, { headers })
      .subscribe({
        next: res => {
          this.postList = res as Post[];
        },
        error: err => {
          console.error('Error fetching post data:', err);
        }
      })
  }

  addPost(formData: FormData): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post(`${this.apiUrl}/Post`, formData, { headers });
  }

  updatePost(id: string, formData: FormData): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put(`${this.apiUrl}/Post/${id}`, formData, { headers });
  }

  changePublishPost(id: string, formData: FormData): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put(`${this.apiUrl}/Post/publish/${id}`, formData, { headers });
  }

  getSinglePost(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.get(`${this.apiUrl}/Post/${id}`, { headers });
  }

  deletePost(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.delete(`${this.apiUrl}/Post/${id}`, { headers });
  }
}
