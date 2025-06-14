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

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { HeaderComponent } from './admin/components/header/header.component';
import { SidebarComponent } from './admin/components/sidebar/sidebar.component';
import { UserPageComponent } from './admin/pages/user-page/user-page.component';
import { CategoryPageComponent } from './admin/pages/category-page/category-page.component';
import { PostPageComponent } from './admin/pages/post-page/post-page.component';
import { DashboardPageComponent } from './admin/pages/dashboard-page/dashboard-page.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AuthComponent } from './admin/pages/auth/auth.component';



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
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzTableModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class AppModule { }