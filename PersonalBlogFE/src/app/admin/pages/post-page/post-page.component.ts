import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent {
  
  // ========== Public properties ==========
  currentPage: number = 1
  pageSize: number = 10
  defaultImage: string = environment.defaultImageUrl

  // ========== Constructor ==========
  constructor(public service: PostService, private toastr: ToastrService) { }

  // ========== Lifecycle hooks ==========
  ngOnInit(): void {
    this.service.refreshPost()
  }

  // ========== Public methods ==========
  onPageChange(page: number): void {
    this.currentPage = page
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // ========== Getter ==========
  get paginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.service.postList.slice(startIndex, startIndex + this.pageSize)
  }

  get totalItems() {
    return this.service.postList.length
  }
}