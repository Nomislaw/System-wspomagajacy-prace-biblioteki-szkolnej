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
    const errorText = await res.text(); 
    throw new Error(errorText || "Błąd API");
  }

  return res.json();
};
