import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/shared/blog-app.model';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {

  // ========== Public properties ==========
  currentPage: number = 1
  pageSize: number = 10
  isAddModalVisible = false
  isDeleteModalVisible = false

  category: Category = new Category()

  isUpdate: boolean = false

  formErrors = {
    name: '',
    description: '',
    slug: ''
  }

  // ========== Constructor ==========
  constructor(public service: CategoryService, private toastr: ToastrService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.service.refreshCategory()
  }

  // ========== Public methods ==========
  onPageChange(page: number): void {
    this.currentPage = page
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  showModal(isUpdate: boolean = false, id: string = ''): void {
    if (isUpdate && id) {
      this.isUpdate = isUpdate
      this.getCategory(id)
    } else {
      this.resetForm()
    }
    this.isAddModalVisible = true
    this.resetFormErrors()
  }

  getCategory(id: string): void {
    this.service.getUser(id).subscribe({
      next: res => {
        this.category = res as Category
      },
      error: err => {
        console.log(err)
      }
    })
  }

  resetForm() {
    this.category = new Category
    this.isUpdate = false
  }

  resetFormErrors() {
    this.formErrors = {
      name: '',
      slug: '',
      description: ''
    }
  }

  clearError(field: keyof typeof this.formErrors): void {
    if (this.formErrors[field]) {
      this.formErrors[field] = '';
    }
  }

  submitCategory(): void {
    if (this.isUpdate) {
      this.updateCategory()
    } else {
      this.addCagetory()
    }
  }

  updateCategory(): void {
    if (this.categoryValidation()) return

    const formData = new FormData()
    formData.append('Name', this.category.name)
    formData.append('Slug', this.category.slug)
    formData.append('Description', this.category.description)

    this.service.updateCategory(this.category.id, formData).subscribe({
      next: res => {
        console.log(res)
        this.toastr.success(res.message, 'Category Info')
        this.service.refreshCategory()
        this.resetFormErrors()
      },
      error: err => {
        console.log(err.error.message)
        this.toastr.error(err.error.message, 'Category Info')
      }
    })
  }

  addCagetory(): void {
    if (this.categoryValidation()) return

    const formData = new FormData()
    formData.append('Name', this.category.name)
    formData.append('Slug', this.category.slug)
    formData.append('Description', this.category.description)

    this.service.addCategory(formData)
      .subscribe({
        next: res => {
          this.toastr.success(res.message, 'Category Info')
          this.service.refreshCategory()
          this.resetForm()
          this.resetFormErrors()
        },
        error: err => {
          console.log(err.error.message)
          this.toastr.error(err.error.message, 'Category Info')
        }
      })
  }

  deleteCategory(id: string): void {
    this.service.deleteCategory(id).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Category Info')
        this.service.refreshCategory()
        this.resetForm()
        this.isDeleteModalVisible = false
      },
      error: err => {
        this.toastr.error(err.error.message, 'Category Info', {
          toastClass: 'ngx-toastr custom-toast'
        })
      }
    })
  }

  showDeleteModal(id: string): void {
    this.isDeleteModalVisible = true
    this.getCategory(id)
  }

  handleCancel(isDeleteModal: boolean): void {
    if (isDeleteModal) this.isDeleteModalVisible = false
    else this.isAddModalVisible = false
  }

  categoryValidation(): boolean {
    this.resetFormErrors()

    let result = false

    if (!this.category.name || this.category.name.trim() === '') {
      this.formErrors.name = 'Name is required'
      result = true
    }

    if (!this.category.slug || this.category.slug.trim() === '') {
      this.formErrors.slug = 'Slug is required'
      result = true
    }

    if (!this.category.description || this.category.description.trim() === '') {
      this.formErrors.description = 'Description is required'
      result = true
    }

    return result
  }

  // ========== Getter ==========
  get paginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.service.categoryList.slice(startIndex, startIndex + this.pageSize)
  }

  get totalItems() {
    return this.service.categoryList.length
  }

  // ========== Modal Styles ==========
  modalStyle = {
    width: '650px'
  };

  modalDeleteStyle = {
    width: '300px',
    top: '250px'
  }
}
