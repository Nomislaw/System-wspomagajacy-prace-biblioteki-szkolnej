const API_URL = "https://localhost:44389/api";

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
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

    let errorMessage = "";

    if (errorData.errors) {
      if (Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join("\n");
      } else if (typeof errorData.errors === "object") {
        errorMessage = Object.values(errorData.errors).flat().join("\n");
      } else {
        errorMessage = String(errorData.errors);
      }
    } else {
      errorMessage = "Nieznany błąd API";
    }

    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
};
