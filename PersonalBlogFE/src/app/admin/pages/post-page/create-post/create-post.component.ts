import { Component, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/shared/blog-app.model';
import { UploadAdapter } from 'src/app/shared/upload-adapter';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  public Editor = ClassicEditor as any;
  public editorConfig = {
    licenseKey: 'GPL',
    extraPlugins: [UploadAdapterPlugin]
  };

  // ========== Public properties ==========

  isImageDisplayed: boolean = false
  previewImageUrl: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null

  post: Post = new Post()
  categoryIdSelected: string = ''

  // ========== Constructor ==========
  constructor(public postService: PostService, public categoryService: CategoryService, private toastr: ToastrService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.categoryService.refreshCategory()
  }

  // ========== Public methods ==========
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onImageSelected(event: Event, isAdd: boolean): void {
    if (isAdd)
      this.isImageDisplayed = !this.isImageDisplayed

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

  removeImage(): void {
    this.isImageDisplayed = !this.isImageDisplayed
    this.previewImageUrl = null
    this.selectedImageFile = null
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
  }

  submit(): void {
    if (this.postValidation()) return

    const formData = new FormData()
    formData.append('Title', this.post.title)
    formData.append('Content', this.post.content)
    formData.append('CategoryId', this.categoryIdSelected)
    formData.append('IsPublished', 'true')
    formData.append('AuthorId', localStorage.getItem('userId') as string)

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile)
    }

    this.postService.addPost(formData)
      .subscribe({
        next: res => {
          console.log(res)
          this.toastr.success(res.message, 'Post Info')
          this.clear()
        },
        error: err => {
          console.log(err.error.message)
          this.toastr.error(err.error.message, 'Post Info', {
            toastClass: 'ngx-toastr custom-toast'
          })
        }
      })
  }

  clear(): void {
    this.isImageDisplayed = false
    this.previewImageUrl = null
    this.selectedImageFile = null
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
    this.post = new Post()
    this.categoryIdSelected = ''
  }

  postValidation(): boolean {
    if (!this.post.title || this.post.title.trim() === '') {
      this.toastr.error('Title is required.', 'Post Info')
      return true
    }

    if (!this.categoryIdSelected || this.categoryIdSelected.trim() === '') {
      this.toastr.error('Category is required.', 'Post Info')
      return true
    }

    if (!this.post.content || this.post.content.trim() === '') {
      this.toastr.error('Content is required.', 'Post Info')
      return true
    }

    return false
  }
}

// UploadAdapterPlugin nằm ngoài component
function UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader);
  };
}

