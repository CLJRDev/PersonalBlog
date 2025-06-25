import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../shared/blog-app.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl: string = environment.apiBaseUrl
  categoryList: Category[] = []

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return headers
  }

  refreshCategory() {
    const headers = this.getHeaders()

    return this.http.get(`${this.apiUrl}/Category`, { headers })
      .subscribe({
        next: res => {
          this.categoryList = res as Category[];
        },
        error: err => {
          console.error('Error fetching category data:', err);
        }
      })
  }

  getUser(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.get(`${this.apiUrl}/Category/${id}`, { headers });
  }

  addCategory(formData: FormData): Observable<any> {
    const headers = this.getHeaders()

    return this.http.post(`${this.apiUrl}/Category`, formData, { headers });
  }

  updateCategory(id: string, formData: FormData): Observable<any> {
    const headers = this.getHeaders()

    return this.http.put(`${this.apiUrl}/Category/${id}`, formData, { headers });
  }

  deleteCategory(id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.delete(`${this.apiUrl}/Category/${id}`, { headers });
  }
}
