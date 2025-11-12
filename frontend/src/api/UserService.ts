import { fetchAPI } from "./api"; 
import { User, UpdateUserDto, ChangePasswordDto, Role } from "../types/Index";


export const UserService = {
  getProfile: async (userId: number): Promise<User> => {
    return fetchAPI(`/users/${userId}`);
  },

  updateProfile: async (userId: number, data: UpdateUserDto): Promise<User> => {
    return fetchAPI(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (userId: number, data: ChangePasswordDto): Promise<User> => {
    return fetchAPI(`/users/${userId}/change-password`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return fetchAPI(`/users`, {
      method: "GET",
    });
  },

  addUser: async (data: Partial<User>): Promise<User> => {
    return fetchAPI(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changeUserRole: async (userId: number, newRole: Role): Promise<User> => {
    return fetchAPI(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role: newRole }),
    });
  },

  deleteUser: async (userId: number): Promise<void> => {
    return fetchAPI(`/users/${userId}`, {
      method: "DELETE",
    });
  },

  activeUser: async (userId: number): Promise<void> => {
    return fetchAPI(`/users/${userId}/active-profile`, {
      method: "PUT",
    });
  },

  sendTokenToUser: async (userId: number): Promise<void> => {
    return fetchAPI(`/users/${userId}/send-verify-token`, {
      method: "POST",
    });
  },
};
