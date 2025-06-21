import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/blog-app.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  // ========== Public properties ==========
  currentPage: number = 1
  pageSize: number = 10
  isVisible = false

  user: User = new User()
  previewImageUrl: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null

  // ========== Constructor ==========
  constructor(public service: UserService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.service.refreshUser()
  }

  // ========== Public methods ==========
  onPageChange(page: number): void {
    this.currentPage = page
  }

  showModal(): void {
    this.isVisible = true
    this.resetForm()
  }

  addUser(): void {
    const formData = new FormData()
    formData.append('Username', this.user.username)
    formData.append('FullName', this.user.fullName)
    formData.append('PassWord', this.user.password)
    formData.append('ConfirmPassword', this.user.confirmPassword)
    formData.append('Email', this.user.email)
    formData.append('IsAdmin', this.user.isAdmin.toString())

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile)
    }

    this.service.addUser(formData)
      .subscribe({
        next: res => {
          console.log(res)
          this.service.refreshUser()
          this.resetForm()
        },
        error: err => {
          console.log(err)
        }
      })
  }

  handleCancel(): void {
    this.isVisible = false
    console.log('Modal cancelled')
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      this.selectedImageFile = file

      const reader = new FileReader()
      reader.onload = () => {
        this.previewImageUrl = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  resetForm() {
    this.user = new User
    this.previewImageUrl = '../../../../assets/images/admin/default-avt.png'
    this.selectedImageFile = null
  }

  // ========== Getter ==========
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.service.userList.slice(startIndex, startIndex + this.pageSize)
  }

  get totalItems() {
    return this.service.userList.length
  }

  // ========== Modal Styles ==========
  modalStyle = {
    width: '650px'
  };

}
