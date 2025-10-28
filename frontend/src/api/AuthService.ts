import { fetchAPI } from "./api";
import { User } from "../types/Index";

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const user = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return user;
  } catch (err: any) {
    throw new Error(err.message || "Błąd logowania");
  }
};

export const register = async (req: {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}): Promise<User> => {
  try {
    const user = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(req),
    });
    return user;
  } catch (err: any) {
    throw new Error(err.message || "Błąd rejestracji");
  }
};
