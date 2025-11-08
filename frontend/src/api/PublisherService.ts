import { fetchAPI } from "./api";
import { Publisher } from "../types/Index";

export const PublisherService = {
  getAllPublishers: async (): Promise<Publisher[]> =>
    fetchAPI("/publishers"),

  addPublisher: async (publisher: Partial<Publisher>) =>
    fetchAPI("/publishers", {
      method: "POST",
      body: JSON.stringify(publisher),
    }),

  updatePublisher: async (id: number, publisher: Partial<Publisher>) =>
    fetchAPI(`/publishers/${id}`, {
      method: "PUT",
      body: JSON.stringify(publisher),
    }),

    deletePublisher: async (Id: number): Promise<void> => {
    return fetchAPI(`/publishers/${Id}`, {
      method: "DELETE",
    });
  },
};
