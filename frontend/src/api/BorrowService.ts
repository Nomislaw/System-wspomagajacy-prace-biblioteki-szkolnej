import { fetchAPI } from "./api";
import { Borrow, BorrowStatus } from "../types/Index";

export const BorrowService = {
  getAllBorrows: async (): Promise<Borrow[]> => {
    return fetchAPI(`/borrows`, {
      method: "GET",
    });
  },
  
  getAllUserBorrows: async (): Promise<Borrow[]> => {
    return fetchAPI(`/borrows/user`, {
      method: "GET",
    });
  },

  updateBorrowStatus: async (borrowId: number, newStatus: BorrowStatus): Promise<void> => {
    return fetchAPI(`/borrows/${borrowId}/status`, {
      method: "PUT",
      body: JSON.stringify(newStatus),
    });
  },

  updateOverdueBorrows: async (): Promise<void> => {
    return fetchAPI(`/borrows/update-overdue`, {
      method: "PUT",
    });
  },

  setBorrowReturnDate: async (id: number): Promise<void> => {
    return fetchAPI(`/borrows/${id}/set-return-date`, {
      method: "PUT",
    });
  },
};
