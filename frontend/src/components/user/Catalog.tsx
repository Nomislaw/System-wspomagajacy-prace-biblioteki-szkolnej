import React, { useEffect, useState } from "react";
import { Book, Borrow, Reservation } from "../../types/Index";
import { BookService } from "../../api/BookService";
import { ReservationService } from "../../api/ReservationService";
import { BorrowService } from "../../api/BorrowService";
import styles from "./User.module.css";

interface CatalogProps {
  categoryId?: number;
}

const Catalog: React.FC<CatalogProps> = ({ categoryId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");

  const fetchData = async () => {
    try {
      const [booksRes, reservationsRes, borrowsRes] = await Promise.all([
        BookService.getAllBooks(),
        ReservationService.getAllUserReservations(),
        BorrowService.getAllUserBorrows(),
      ]);

      setBooks(booksRes);
      setReservations(reservationsRes);
      setBorrows(borrowsRes);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania danych");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesAuthor = book.authorName?.toLowerCase().includes(searchAuthor.toLowerCase()) ?? true;
    const matchesCategory = !categoryId || book.categoryId === categoryId;
    return matchesTitle && matchesAuthor && matchesCategory;
  });

  const getButtonState = (book: Book) => {
    const userReservation = reservations.find(r => r.bookId === book.id && r.reservationStatus === "Active");
    const userBorrow = borrows.find(b => b.bookId === book.id && (b.borrowStatus === "Active" || b.borrowStatus === "Overdue"));
    const bookAvailable = books.find(b => b.id === book.id && b.available <=0 );

    if (userBorrow) return { text: "Wypożyczone", disabled: true };
    if (userReservation) return { text: "Anuluj rezerwację", disabled: false };
    if (bookAvailable) return { text: "Niedostępne", disabled: true};
    return { text: "Rezerwuj", disabled: false };
  };

  const handleReserveToggle = async (book: Book) => {
    try {
      const userReservation = reservations.find(r => r.bookId === book.id && r.reservationStatus === "Active");

      if (userReservation) {
        if (!window.confirm("Na pewno chcesz anulować rezerwację?")) return;
        await ReservationService.cancelReservationUser(book.id);
      } else {
        if (!window.confirm("Na pewno chcesz dokonać rezerwacji?")) return;
        await ReservationService.reserveBook(book.id);
      }

      fetchData(); 
    } catch (err :any) {
      alert(err.message || "Błąd przy rezerwacji/anulowaniu książki");
    }
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
          {filteredBooks.map((book) => {
            const { text, disabled } = getButtonState(book);

            return (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookHeader}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <span className={styles.categoryTag}>{book.categoryName || "Bez kategorii"}</span>
                </div>
                <p className={styles.p}><strong>Autor:</strong> {book.authorName || "—"}</p>
                <p className={styles.p}><strong>Rok:</strong> {book.publicationYear}</p>
                <p className={styles.p}><strong>Wydawnictwo:</strong> {book.publisherName || "—"}</p>
                <p className={styles.p}><strong>ISBN:</strong> {book.isbn}</p>
                <p className={styles.p}><strong>Dostępne:</strong> {book.available}</p>

                <button
                  className={`${styles.reserveButton} ${text === "Anuluj rezerwację" ? styles.cancelButton : ""} 
                  ${text === "Wypożyczone" ? styles.borrowedButton : ""} ${text === "Niedostępne" ? styles.disabledButton : ""}`}
                  onClick={() => handleReserveToggle(book)}
                  disabled={disabled}
                >
                  {text}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Catalog;
