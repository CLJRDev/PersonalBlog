import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';


import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { HeaderComponent } from './admin/components/header/header.component';
import { SidebarComponent } from './admin/components/sidebar/sidebar.component';
import { UserPageComponent } from './admin/pages/user-page/user-page.component';
import { CategoryPageComponent } from './admin/pages/category-page/category-page.component';
import { PostPageComponent } from './admin/pages/post-page/post-page.component';
import { DashboardPageComponent } from './admin/pages/dashboard-page/dashboard-page.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AuthLayoutComponent } from './auth/auth-layout.component';
import { CreatePostComponent } from './admin/pages/post-page/create-post/create-post.component';
import { PostViewComponent } from './admin/pages/post-page/post-view/post-view.component';
import { BlogLayoutComponent } from './blog/blog-layout.component';
import { BlogHeaderComponent } from './blog/components/blog-header/blog-header.component';
import { BlogSidebarComponent } from './blog/components/blog-sidebar/blog-sidebar.component';


registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    UserPageComponent,
    CategoryPageComponent,
    PostPageComponent,
    DashboardPageComponent,
    DateFormatPipe,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthLayoutComponent,
    CreatePostComponent,
    PostViewComponent,
    BlogHeaderComponent,
    BlogSidebarComponent,
    BlogLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzTableModule,
    HttpClientModule,
    NzPaginationModule,
    NzCheckboxModule,
    NzButtonModule,
    NzModalModule,
    CommonModule,
    CKEditorModule,
    NzRadioModule,
    NzSelectModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
  ],

  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class AppModule { }