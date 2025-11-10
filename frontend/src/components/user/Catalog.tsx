import React, { useEffect, useState } from "react";
import { Book } from "../../types/Index";
import { BookService } from "../../api/BookService";
import styles from "./User.module.css";

interface CatalogProps {
  categoryName?: string;
}

const Catalog: React.FC<CatalogProps> = ({ categoryName }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");

  const fetchData = async () => {
    try {
      const booksRes = await BookService.getAllBooks();
      setBooks(booksRes);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania danych o książkach");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesAuthor = book.authorName?.toLowerCase().includes(searchAuthor.toLowerCase()) ?? true;
    const matchesCategory = !categoryName || book.categoryName === categoryName;
    return matchesTitle && matchesAuthor && matchesCategory;
  });

  const handleReserve = (bookId: number) => {
    // TODO: podłącz logikę rezerwacji/wypożyczenia
    alert(`Rezerwujesz książkę o ID: ${bookId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Katalog książek</h2>

      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Szukaj po tytule..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Szukaj po autorze..."
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p className={styles.noResults}>Brak książek spełniających kryteria.</p>
      ) : (
        <div className={styles.booksGrid}>
          {filteredBooks.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              <div className={styles.bookHeader}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <span className={styles.categoryTag}>
                  {book.categoryName || "Bez kategorii"}
                </span>
              </div>
              <p className={styles.p}><strong>Autor:</strong> {book.authorName || "—"}</p>
              <p className={styles.p}><strong>Rok:</strong> {book.publicationYear}</p>
              <p className={styles.p}><strong>Wydawnictwo:</strong> {book.publisherName || "—"}</p>
              <p className={styles.p}><strong>Dostępne:</strong> {book.quantity}</p>

              <button
                className={styles.reserveButton}
                onClick={() => handleReserve(book.id)}
              >
                Rezerwuj
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
