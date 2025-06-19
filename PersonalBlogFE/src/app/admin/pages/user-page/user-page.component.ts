import { Component, OnInit } from '@angular/core';
import { he } from 'date-fns/locale';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  // ========== Public properties ==========
  currentPage: number = 1;
  pageSize: number = 10;
  isVisible = false;
  isAdmin: boolean = false;
  username: string = '';
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  // ========== Constructor ==========
  constructor(public service: UserService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.service.refreshUser();
  }

  // ========== Public methods ==========
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  showModal(): void {
    this.isVisible = true;
    this.isAdmin = false;
    this.username = '';
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    console.log('Show modal for adding a new user');
  }

  handleOk(): void {
    this.isVisible = false;
    console.log('Modal closed');
  }

  handleCancel(): void {
    this.isVisible = false;
    console.log('Modal cancelled');
  }

  // ========== Getter ==========
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.service.userList.slice(startIndex, startIndex + this.pageSize);
  }

  get totalItems() {
    return this.service.userList.length;
  }

  // ========== Modal Styles ==========
  modalStyle = {
    width: '650px'
  };

}
