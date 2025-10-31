
export type Role = "User" | "Librarian" | "Administrator"; 

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  books: string[];
}

export interface Publisher {
  id: number;
  name: string;
  books: string[];
}

export interface Category {
  id: number;
  name: string;
  books: string[];
}

export interface Book {
  id: number;
  title: string;
  publicationYear: number;
  isbn: string;
  authorId: number;
  author: Author;
  publisherId: number;
  publisher: Publisher;
  categoryId: number;
  category: Category;
  copies: Copy[];
  reviews: Review[];
}

export interface Copy {
  id: number;
  bookId: number;
  book: Book;
  isAvailable: boolean;
}

export interface Borrow {
  id: number;
  copyId: number;
  copy: Copy;
  userId: number;
  user: string;
  borrowDate: string;
  returnDate?: string;
}

export interface Reservation {
  id: number;
  copyId: number;
  copy: Copy;
  userId: number;
  user: string;
  reservationDate: string;
}

export interface Review {
  id: number;
  bookId: number;
  book: Book;
  userId: number;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  token: string;
  emailConfirmed: boolean;
  verificationToken: string;
  borrows?: Borrow[];
  reservations?: Reservation[];
  reviews?: Review[];
}

export interface Report {
  id: number;
  title: string;
  createdAt: string;
  content: string;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordDto{
  oldPassword: string;
  newPassword: string;
}