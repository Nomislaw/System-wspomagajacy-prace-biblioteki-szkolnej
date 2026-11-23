import { fetchAPI } from "./api";
import { Book } from "../types/Index";

export const BookService = {
  getAllBooks: async (): Promise<Book[]> => {
    return fetchAPI(`/books`, {
      method: "GET",
    });
  },

  getAllStudentBooks: async (): Promise<Book[]> => {
    return fetchAPI(`/books/students`, {
      method: "GET",
    });
  },

  getAllTeacherBooks: async (): Promise<Book[]> => {
    return fetchAPI(`/books/teachers`, {
      method: "GET",
    });
  },

  addBook: async (data: Partial<Book>): Promise<Book> => {
    return fetchAPI(`/books`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateBook: async (bookId: number, data: Partial<Book>): Promise<Book> => {
    return fetchAPI(`/books/${bookId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteBook: async (bookId: number): Promise<void> => {
    return fetchAPI(`/books/${bookId}`, {
      method: "DELETE",
    });
  },

  changeIsOnlyForTeacher: async (bookId: number): Promise<void> => {
    return fetchAPI(`/books/${bookId}/change-is-only-for-teacher`, {
      method: "PUT",
    });
  },

  getBookById: async (bookId: number): Promise<Book> => {
  return fetchAPI(`/books/${bookId}`, {
    method: "GET",
  });
},

};
