import { fetchAPI } from "./api";
import { Reservation } from "../types/Index";

export const ReservationService = {
  getAllReservations: async (): Promise<Reservation[]> => {
    return fetchAPI(`/reservations`, { method: "GET" });
  },

  getReservationById: async (id: number): Promise<Reservation> => {
    return fetchAPI(`/reservations/${id}`, { method: "GET" });
  },

  cancelReservation: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/${id}/cancel`, { method: "PUT" });
  },

  convertToBorrow: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/convert/${id}`, { method: "POST" });
  },

  updateExpiredReservations: async (): Promise<void> => {
    return fetchAPI(`/reservations/update-expired`, {
      method: "PUT",
    });
  },
};
