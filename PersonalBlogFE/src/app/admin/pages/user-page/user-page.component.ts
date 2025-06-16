import { Component, OnInit } from '@angular/core';
import { BlogAppService } from 'src/app/services/blog-app.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  // ========== Public properties ==========
  currentPage: number = 1;
  pageSize: number = 10;

  // ========== Constructor ==========
  constructor(public service: BlogAppService) {}

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.service.refreshUser();
  }

  // ========== Public methods ==========
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ========== Getter ==========
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.service.userList.slice(startIndex, startIndex + this.pageSize);
  }

  get totalItems(){
    return this.service.userList.length;
  }
}
