import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './admin-dashboard/user/user.component';
import { CategoryComponent } from './admin-dashboard/category/category.component';
import { PostComponent } from './admin-dashboard/post/post.component';

const routes: Routes = [
  { path: 'post', component: PostComponent },
  { path: 'user', component: UserComponent },
  { path: 'category', component: CategoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
