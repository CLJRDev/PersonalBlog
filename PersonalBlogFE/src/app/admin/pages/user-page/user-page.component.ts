import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/blog-app.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // ========== Public properties ==========
  currentPage: number = 1
  pageSize: number = 10
  isVisible = false

  user: User = new User()
  previewImageUrl: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null
  defaultImage: string = environment.defaultImageUrl

  isUpdate: boolean = false

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

  showModal(isUpdate: boolean = false, id: string = ''): void {
    if (isUpdate && id) {
      this.isUpdate = isUpdate
      this.getdUser(id)
    } else {
      this.resetForm()
    }
    this.isVisible = true
    this.resetFormErrors()
  }

  submitUser(): void {
    if (this.isUpdate) {
      this.updateUser()
    } else {
      this.addUser()
    }
  }

  getdUser(id: string): void {
    this.service.getUser(id).subscribe({
      next: res => {
        this.user = res as User
        this.previewImageUrl = null
        this.selectedImageFile = null
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  updateUser(): void {
    if (this.userValidation()) return

    const formData = new FormData()
    formData.append('Username', this.user.username)
    formData.append('FullName', this.user.fullName)
    if (this.user.password && this.user.confirmPassword) {
      formData.append('Password', this.user.password)
      formData.append('ConfirmPassword', this.user.confirmPassword)
    }
    formData.append('Email', this.user.email)
    formData.append('IsAdmin', this.user.isAdmin.toString())

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile)
    }

    this.service.updateUser(this.user.id, formData).subscribe({
      next: res => {
        console.log(res)
        this.toastr.success(res.message, 'User Info')
        this.service.refreshUser()
        this.resetFormErrors()
      },
      error: err => {
        console.log(err.error.message)
        this.toastr.error(err.error.message, 'User Info', {
          toastClass: 'ngx-toastr custom-toast'
        })
      }
    })
  }

  addUser(): void {
    if (this.userValidation()) return

    const formData = new FormData()
    formData.append('Username', this.user.username)
    formData.append('FullName', this.user.fullName)
    formData.append('Password', this.user.password)
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
          console.log(err.error.message)
          this.toastr.error(err.error.message, 'User Info', {
            toastClass: 'ngx-toastr custom-toast'
          })
        }
      })
  }

  deleteUser(id: string): void {
    if (window.confirm("Are you sure to delete this user?")) {
      this.service.deleteUser(id).subscribe({
        next: res => {
          this.toastr.success(res.message, 'User Info')
          this.service.refreshUser()
        },
        error: err => {
          this.toastr.error(err.error.message, 'User Info', {
            toastClass: 'ngx-toastr custom-toast'
          })
        }
      })
    }
  }

  handleCancel(): void {
    this.isVisible = false
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

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  clearError(field: keyof typeof this.formErrors): void {
    if (field === 'email') {
      if (this.user.email && this.isValidEmail(this.user.email)) {
        this.formErrors.email = '';
      }
      return;
    }

    if (this.formErrors[field]) {
      this.formErrors[field] = '';
    }
  }

  resetForm() {
    this.user = new User
    this.previewImageUrl = this.defaultImage
    this.selectedImageFile = null
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.isUpdate = false
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
    } else if (!this.isValidEmail(this.user.email)) {
      this.formErrors.email = 'Email is invalid';
      result = true;
    }

    if (!this.isUpdate) {
      if (!this.user.password) {
        this.formErrors.password = 'Password is required'
        result = true
      }

      if (!this.user.confirmPassword) {
        this.formErrors.confirmPassword = 'Confirm Password is required'
        result = true
      }
    } else {
      if (this.user.password && !this.user.confirmPassword) {
        this.formErrors.confirmPassword = 'Confirm Password is required'
        result = true
      }
      if (!this.user.password && this.user.confirmPassword) {
        this.formErrors.password = 'Password is required'
        result = true
      }
    }

    return result
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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