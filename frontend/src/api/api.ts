const API_URL = "https://localhost:44389/api";

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

   if (!res.ok) {
    let errorData;

    try {
      errorData = await res.json();
    } catch {
      throw new Error("Nie udało się odczytać błędu z serwera");
    }

    console.log("Błąd API:", errorData);

    const errorMessage = Array.isArray(errorData.errors)
      ? errorData.errors.join("\n")
      : errorData.errors || "Nieznany błąd API";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
};
