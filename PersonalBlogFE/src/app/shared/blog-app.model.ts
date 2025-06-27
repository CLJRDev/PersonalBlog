export class User {
  id: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  fullName: string = '';
  isAdmin: boolean = false;
  isConfirmEmail: boolean = false;
  imageUrl: string = '';
  createdAt: string = '';
}


export class Category {
  id: string = '';
  name: string = '';
  slug: string = '';
  description: string = '';
  createdAt: string = '';
}

export interface CategorySummary {
  id: string;
  name: string;
}

export interface AuthorSummary {
  id: string;
  fullName: string;
  imageUrl: string;
  isAdmin: boolean;
}

export class Post {
  id: string = '';
  title: string = '';
  slug: string = '';
  content: string = '';
  imageUrl: string = '';
  createdAt: string = '';
  updatedAt: string = '';
  isPublished: boolean = false;
  category?: CategorySummary;
  author?: AuthorSummary;
}