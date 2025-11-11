import { fetchAPI } from "./api"; 

export const ReportService = {
  getUserReport: async (fromDate: string, toDate: string, userId?: number | string) => {
    const query = new URLSearchParams({
      fromDate,  
      toDate,    
      ...(userId && userId !== "all" ? { userId: String(userId) } : {}),
    });
console.log("Wysyłam zapytanie do backendu:", `/reports/user-report?${query.toString()}`);

    try {
      const response = await fetchAPI(`/reports/user-report?${query.toString()}`, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Błąd pobierania raportu:", error);
      throw error;
    }
  },
};


