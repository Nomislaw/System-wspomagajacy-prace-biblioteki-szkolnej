import { fetchAPI } from "./api";
import { User } from "../types/User";

export const login = async (email: string, password: string): Promise<User> => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (req: {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}): Promise<User> => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
};
