import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/shared/blog-app.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})

export class PostViewComponent {
  post: Post = new Post()
  safeContent?: SafeHtml;
  defaultImage = environment.defaultImageUrl

  constructor(private route: ActivatedRoute, private postService: PostService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id')!
    this.getPost(postId)
  }

  getPost(postId: string): void {
    this.postService.getSinglePost(postId)
      .subscribe({
        next: res => {
          console.log(res)
          this.post = res as Post
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(res.content)
        },
        error: err => {
          console.log(err)
        }
      })
  }
}
