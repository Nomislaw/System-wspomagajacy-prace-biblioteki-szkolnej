export type Role = "User" | "Librarian" | "Administrator";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  borrows?: Borrow[];
  reservations?: Reservation[];
  reviews?: Review[];
}

export interface Borrow { id: number; bookTitle: string; borrowDate: string; returnDate?: string; }
export interface Reservation { id: number; bookTitle: string; reservationDate: string; }
export interface Review { id: number; bookTitle: string; content: string; rating: number; }
