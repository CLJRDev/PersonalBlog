import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  formErrors = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  // ========== Constructor ==========
  constructor(public service: UserService, private toastr: ToastrService) { }

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
    this.resetFormErrors()
  }

  addUser(): void {
    if (this.userValidation()) return

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
          this.toastr.success(res.message, 'User Info')
          this.service.refreshUser()
          this.resetForm()
          this.resetFormErrors()
        },
        error: err => {
          console.log(err)
          this.toastr.error(err.errors, 'User Info')
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

  clearError(field: keyof typeof this.formErrors): void {
    if (this.formErrors[field]) {
      this.formErrors[field] = '';
    }
  }

  resetForm() {
    this.user = new User
    this.previewImageUrl = '../../../../assets/images/admin/default-avt.png'
    this.selectedImageFile = null
  }

  resetFormErrors() {
    this.formErrors = {
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  userValidation(): boolean {
    this.resetFormErrors()

    let result = false

    if (!this.user.username || this.user.username.trim() === '') {
      this.formErrors.username = 'Username is required'
      result = true
    }

    if (!this.user.fullName || this.user.fullName.trim() === '') {
      this.formErrors.fullName = 'Full name is required'
      result = true
    }

    if (!this.user.email || this.user.email.trim() === '') {
      this.formErrors.email = 'Email is required'
      result = true
    }

    if (!this.user.password || this.user.password.trim() === '') {
      this.formErrors.password = 'Password is required'
      result = true
    }

    if (!this.user.confirmPassword || this.user.confirmPassword.trim() === '') {
      this.formErrors.confirmPassword = 'Confirm Password is required'
      result = true
    }

    return result
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
