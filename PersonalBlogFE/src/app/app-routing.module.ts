import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { UserPageComponent } from './admin/pages/user-page/user-page.component';
import { CategoryPageComponent } from './admin/pages/category-page/category-page.component';
import { PostPageComponent } from './admin/pages/post-page/post-page.component';
import { DashboardPageComponent } from './admin/pages/dashboard-page/dashboard-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AuthLayoutComponent } from './auth/auth-layout.component';
import { CreatePostComponent } from './admin/pages/post-page/create-post/create-post.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard], // Ensure user is authenticated
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'user', component: UserPageComponent },
      { path: 'post', component: PostPageComponent },
      { path: 'post/create', component: CreatePostComponent },
      { path: 'category', component: CategoryPageComponent },
      { path: 'dashboard', component: DashboardPageComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent }
    ]
  },
  // fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
