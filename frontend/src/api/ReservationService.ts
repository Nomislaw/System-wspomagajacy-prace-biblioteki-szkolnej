import { fetchAPI } from "./api";
import { Reservation } from "../types/Index";

export const ReservationService = {
  getAllReservations: async (): Promise<Reservation[]> => {
    return fetchAPI(`/reservations`, { method: "GET" });
  },

   getAllUserReservations: async (): Promise<Reservation[]> => {
    return fetchAPI(`/reservations/user`, { method: "GET" });
  },

  reserveBook: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/${id}`, { method: "POST" });
  },

  cancelReservationUser: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/${id}/cancel-user`, { method: "PUT" });
  },

  cancelReservation: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/${id}/cancel`, { method: "PUT" });
  },

  convertToBorrow: async (id: number): Promise<void> => {
    return fetchAPI(`/reservations/${id}/convert`, { method: "POST" });
  },

};
