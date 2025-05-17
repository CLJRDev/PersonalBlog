# 📝 DevBlog - A Simple Blog Platform for Developers

DevBlog is a blogging platform built with ASP.NET Core and Entity Framework Core. It allows admin users to manage blog posts and categories, and visitors to read the latest articles by category.

---

## 🚀 Features

### Public Website
- View the 10 latest blog posts
- Filter posts by category
- Pagination support

### Admin Panel (Authentication required)
- **Post Management**: Create, Read, Update, Delete (CRUD)
- **Category Management**: Create, Read, Update, Delete (CRUD)
- Search & filter functionality for both posts and categories
- Upload feature for featured images
- Integrated CKEditor for rich text editing
- User login/logout for admin access

---

## 🛠️ Tech Stack

### Backend
- **.NET 6**
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **SQL Server**

### Frontend
- HTML, CSS, JavaScript, Angular 16
- Fetch API for backend communication
- CKEditor for content editing

---

## 📁 Project Structure

/PersonalBlog
--Models/ # EF Core entity models
--Controllers/ # API controllers for Posts, Categories, Auth
--Program.cs # Application entry point

