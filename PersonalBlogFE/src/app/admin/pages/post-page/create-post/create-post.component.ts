import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/shared/blog-app.model';


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
  };

  isImageDisplayed: boolean = false
  previewImageUrl: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null

  post: Post = new Post()

  // ========== Constructor ==========
  constructor(public categoryService: CategoryService, private toastr: ToastrService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.categoryService.refreshCategory()
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onImageSelected(event: Event): void {
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


}
