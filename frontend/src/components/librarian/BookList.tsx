import React, { useEffect, useState } from "react";
import { Book } from "../../types/Index";
import { BookService } from "../../api/BookService";
import styles from "./Librarian.module.css";
import { useNavigate } from "react-router-dom";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState(""); 
  const navigate = useNavigate();

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Na pewno chcesz usunąć tę książkę?")) return;

    try {
      await BookService.deleteBook(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania książki");
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSection}>
          <button
            className={styles.navigateButton}
            onClick={() => navigate("/librarian/books/add")}
          >
            Dodaj książkę
          </button>
        </div>

        <h2 className={styles.title}>Lista książek</h2>
        <input
            type="text"
            className={styles.input}
            placeholder="Szukaj po tytule..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tytuł</th>
              <th>Rok</th>
              <th>ISBN</th>
              <th>Ilość</th>
              <th>Autor</th>
              <th>Kategoria</th>
              <th>Wydawnictwo</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>
                  Brak książek pasujących do wyszukiwania.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.authorName || "—"}</td>
                  <td>{book.categoryName || "—"}</td>
                  <td>{book.publisherName || "—"}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/librarian/books/edit/${book.id}`)}
                    >
                      Edytuj
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(book.id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
