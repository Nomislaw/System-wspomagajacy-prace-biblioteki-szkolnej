const API_URL = "https://localhost:44389/api";

export async function getBooks() {
  const res = await fetch(`${API_URL}/books`);
  return res.json();
}

export async function addBook(book: { title: string; author: string; year: number }) {
  const res = await fetch(`${API_URL}/books`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
}