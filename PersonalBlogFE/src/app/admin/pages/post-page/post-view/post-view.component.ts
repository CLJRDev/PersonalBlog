import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/shared/blog-app.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})

export class PostViewComponent {
  post: Post = new Post()
  safeContent?: SafeHtml;
  defaultImage: string = environment.defaultImageUrl
  isModalVisible: boolean = false

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id')!
    this.getPost(postId)
  }

  getPost(postId: string): void {
    this.postService.getSinglePost(postId)
      .subscribe({
        next: res => {
          this.post = res as Post
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(res.content)
        },
        error: err => {
          console.log(err)
        }
      })
  }

  handleCancel(): void {
    this.isModalVisible = false
  }

  showModel(): void {
    this.isModalVisible = true
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
