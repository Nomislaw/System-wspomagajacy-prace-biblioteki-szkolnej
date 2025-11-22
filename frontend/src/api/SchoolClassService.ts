import { fetchAPI } from "./api";
import { SchoolClass, User } from "../types/Index";

export const SchoolClassService = {
  getAllClasses: async (): Promise<SchoolClass[]> => {
    return fetchAPI(`/schoolclasses`, {
      method: "GET",
    });
  },

  getStudents: async (classId: number): Promise<User[]> => {
    return fetchAPI(`/users/by-class/${classId}`, {
      method: "GET",
    });
  },

  changeUserClass: async (id: number, newClassId?: number): Promise<void> => {
    return fetchAPI(`/users/${id}/change-class`, {
      method: "PUT",
      body: JSON.stringify(newClassId),
    });
  },

  updateClass: async (classId: number, data: Partial<SchoolClass>): Promise<SchoolClass> => {
    return fetchAPI(`/schoolclasses/${classId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  addClass: async (data: Partial<SchoolClass>): Promise<SchoolClass> => {
    return fetchAPI(`/schoolclasses`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteClass: async (id: number): Promise<void> => {
    return fetchAPI(`/schoolclasses/${id}`, {
      method: "DELETE",
    });
  },
};
