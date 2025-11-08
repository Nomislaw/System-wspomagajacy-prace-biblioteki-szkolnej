import { fetchAPI } from "./api"; 
import { Author, UpdatePersonDto} from "../types/Index";

export const AuthorService = {
  getAllAuthors: async (): Promise<Author[]> => {
    return fetchAPI(`/authors`, {
      method: "GET",
    });
  },

  updateAuthor: async (authorId: number, data: UpdatePersonDto): Promise<Author> => {
      return fetchAPI(`/authors/profile/${authorId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    addAuthor: async (data: Partial<Author>): Promise<Author> => {
        return fetchAPI(`/authors`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      },

      deleteAuthor: async (Id: number): Promise<void> => {
    return fetchAPI(`/authors/${Id}`, {
      method: "DELETE",
    });
  },
};
