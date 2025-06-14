import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { UserPageComponent } from './admin/pages/user-page/user-page.component';
import { CategoryPageComponent } from './admin/pages/category-page/category-page.component';
import { PostPageComponent } from './admin/pages/post-page/post-page.component';
import { DashboardPageComponent } from './admin/pages/dashboard-page/dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'user', component: UserPageComponent },
      { path: 'post', component: PostPageComponent },
      { path: 'category', component: CategoryPageComponent },
      { path: 'dashboard', component: DashboardPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
