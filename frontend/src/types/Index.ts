
export type Role = "User" | "Librarian" | "Administrator"; 

export enum ReservationStatus {
  Active = "Active",
  Completed = "Completed",
  Canceled = "Canceled",
  Expired = "Expired",
}


export enum BorrowStatus {
  Active = "Active",
  Returned = "Returned",
  ReturnedLate = "ReturnedLate",
  Canceled = "Canceled",
  Overdue = "Overdue",
}


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
  description: string;
  quantity: number;
  available: number;
  authorId: number;
  categoryId: number;
  publisherId: number;
  authorName?: string | null;      
  categoryName?: string | null;
  publisherName?: string | null;
}

export interface Borrow {
  id: number;
  bookId: number;
  bookTitle: string;
  bookCopyId: number;
  userId: number;
  userName: string;
  borrowDate: string;
  terminDate: string;
  returnDate: string;
  borrowStatus: BorrowStatus;
  book?: Book;
}

export interface Reservation {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  userName: string;
  reservationDate: string;
  expirationDate: string;
  reservationStatus: ReservationStatus;
  book?: Book;
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
  className?: string;
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

export interface UpdatePersonDto {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordDto{
  oldPassword: string;
  newPassword: string;
}

export interface BookCopy {
  id: number;
  barCode: string;
  isAvailable: boolean;
  bookId: number;
}

export interface SchoolClass{
  id: number;
  className: string;
  users?: string[];
}