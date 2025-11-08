import { fetchAPI } from "./api";
import { Category } from "../types/Index";

export const CategoryService = {
  getAllCategories: async (): Promise<Category[]> =>
    fetchAPI("/categories"),

  addCategory: async (category: Partial<Category>) =>
    fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),

  updateCategory: async (id: number, category: Partial<Category>) =>
    fetchAPI(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    }),

    deleteCategory: async (Id: number): Promise<void> => {
    return fetchAPI(`/categories/${Id}`, {
      method: "DELETE",
    });
  },
};
