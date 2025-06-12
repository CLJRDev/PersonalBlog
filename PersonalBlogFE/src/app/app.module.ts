import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HeaderComponent } from './admin-dashboard/header/header.component';
import { SidebarComponent } from './admin-dashboard/sidebar/sidebar.component';
import { CategoryComponent } from './admin-dashboard/category/category.component';
import { UserComponent } from './admin-dashboard/user/user.component';
import { PostComponent } from './admin-dashboard/post/post.component';

import { AppRoutingModule } from './app-routing.module'; // Import the routing module


@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    HeaderComponent,
    SidebarComponent,
    CategoryComponent,
    UserComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
