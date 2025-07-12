import { Component, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/shared/blog-app.model';
import { UploadAdapter } from 'src/app/shared/upload-adapter';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('titleTextarea') titleTextarea!: ElementRef<HTMLTextAreaElement>;

  public Editor = ClassicEditor as any;
  public editorConfig = {
    licenseKey: 'GPL',
    extraPlugins: [UploadAdapterPlugin]
  };

  // ========== Public properties ==========

  isImageDisplayed: boolean = false
  previewImageUrl: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null
  isModalVisible = false

  post: Post = new Post()
  categoryIdSelected: string = ''
  isEditPost: boolean = false
  isDeleteModal: boolean = false

  // ========== Constructor ==========
  constructor(
    public postService: PostService,
    public categoryService: CategoryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id')!
    if (postId) {
      this.isEditPost = true
      this.loadEditedPost(postId)
    }
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
    formData.append('AuthorId', localStorage.getItem('userId') as string)

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile)
    }

    if (!this.isEditPost) {
      // Add post
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
    } else {
      // Update post
      this.postService.updatePost(this.post.id, formData)
        .subscribe({
          next: res => {
            console.log(res)
            this.toastr.success(res.message, 'Post Info')
          },
          error: err => {
            console.log(err.error.message)
            this.toastr.error(err.error.message, 'Post Info', {
              toastClass: 'ngx-toastr custom-toast'
            })
          }
        })
    }
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

  loadEditedPost(postId: string): void {
    this.postService.getSinglePost(postId)
      .subscribe({
        next: res => {
          this.post = res as Post
          this.categoryIdSelected = this.post.category?.id || ''
          this.isImageDisplayed = this.post.imageUrl ? true : false
          setTimeout(() => {
            if (this.titleTextarea) {
              const textarea = this.titleTextarea.nativeElement;
              textarea.style.height = 'auto';
              textarea.style.height = textarea.scrollHeight + 'px';
            }
          });
        },
        error: err => {
          this.toastr.error(err.error.message, 'Post Info')
        }
      });
  }

  handleCancel(): void {
    this.isModalVisible = false
  }

  showModel(isDelete: boolean): void {
    this.isModalVisible = true
    this.isDeleteModal = isDelete ? true : false
  }

  changePublish(): void {
    const formData = new FormData()
    formData.append('IsPublished', this.post.isPublished ? 'false' : 'true')

    this.postService.changePublishPost(this.post.id, formData)
      .subscribe({
        next: res => {
          this.post.isPublished = !this.post.isPublished
          this.toastr.success(res.message, 'Post Info')
          this.isModalVisible = false
        },
        error: err => {
          this.toastr.error(err.error.message, 'Post Info', {
            toastClass: 'ngx-toastr custom-toast'
          })
        }
      })
  }

  deletePost(): void {
    this.postService.deletePost(this.post.id)
      .subscribe({
        next: res => {
          this.toastr.success(res.message, 'Post Info')
          this.isModalVisible = false
          this.router.navigate(['/admin/post']);
        },
        error: err => {
          this.toastr.error(err.error.message, 'Post Info', {
            toastClass: 'ngx-toastr custom-toast'
          })
        }
      })
  }

  modalStyle = {
    width: '300px',
    top: '250px'
  }
}

// UploadAdapterPlugin nằm ngoài component
function UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader);
  };
}

