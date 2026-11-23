import React, { useEffect, useState } from "react";
import { Book } from "../../../types/Index";
import { BookService } from "../../../api/BookService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AddTeacherBook: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState(""); 
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const booksRes = await BookService.getAllStudentBooks();
      setBooks(booksRes);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania danych o książkach");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (id: number) => {

    try {
      await BookService.changeIsOnlyForTeacher(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err || "Błąd podczas dodawania książki");
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
              className={styles.returnButton}
              onClick={() => navigate("/librarian/teachers-books")}
            >
            Cofnij
          </button>
        </div>

        <h2 className={styles.title}>Książki przeznaczone tylko dla uczniów</h2>
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
                      className={styles.addButton}
                      onClick={() => handleAdd(book.id)}
                    >
                      Dodaj
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

export default AddTeacherBook;
