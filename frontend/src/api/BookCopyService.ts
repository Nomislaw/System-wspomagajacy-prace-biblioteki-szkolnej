import { fetchAPI } from "./api";
import { BookCopy } from "../types/Index";

export const BookCopyService = {
  getCopiesByBookId: async (bookId: number): Promise<BookCopy[]> => {
    return fetchAPI(`/bookcopies?bookId=${bookId}`, {
      method: "GET",
    });
  },

  getCopyById: async (id: number): Promise<BookCopy> => {
    return fetchAPI(`/bookcopies/${id}`, {
      method: "GET",
    });
  },

  addCopy: async (data: Partial<BookCopy>): Promise<BookCopy> => {
    return fetchAPI(`/bookcopies`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCopy: async (id: number, data: Partial<BookCopy>): Promise<BookCopy> => {
    return fetchAPI(`/bookcopies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCopy: async (id: number): Promise<void> => {
    return fetchAPI(`/bookcopies/${id}`, {
      method: "DELETE",
    });
  },
};
