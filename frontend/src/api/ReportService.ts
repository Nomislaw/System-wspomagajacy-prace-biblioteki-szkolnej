import { fetchAPI } from "./api"; 

export const ReportService = {
  getUserReport: async (fromDate?: string, toDate?: string, userId?: number | string) => {
    const query: Record<string, string> = {};
    if (fromDate) query.fromDate = fromDate; 
    if (toDate) query.toDate = toDate;
    if (userId && userId !== "all") query.userId = String(userId);

    const queryString = new URLSearchParams(query).toString();

    return await fetchAPI(`/reports/user-activity${queryString ? `?${queryString}` : ""}`, { method: "GET" });
  },

   getBooksReport: async () => {
    return await fetchAPI(`/reports/book-state`, { method: "GET" });
  },
};

