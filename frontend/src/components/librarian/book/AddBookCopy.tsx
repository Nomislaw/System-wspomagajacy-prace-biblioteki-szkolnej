import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BookCopyService } from "../../../api/BookCopyService";
import styles from "./../Librarian.module.css";

const AddBookCopy: React.FC = () => {
  const { id } = useParams(); 
  const bookId = id;
  const navigate = useNavigate();

  const location = useLocation();
  const { bookName } = location.state as { bookName: string };

  const [barCode, setBarCode] = useState("");

  const handleAdd = async () => {
    if (!barCode) {
      alert("Podaj kod kreskowy!");
      return;
    }

    try {
      await BookCopyService.addCopy({ bookId: Number(bookId), barCode });
      navigate(`/librarian/books/${bookId}/copies`, { state: { bookName: bookName } });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania egzemplarza.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Dodaj egzemplarz — {bookName}</h2>

      <input
        type="text"
        className={styles.input}
        placeholder="Kod kreskowy"
        value={barCode}
        onChange={(e) => setBarCode(e.target.value)}
      />

      <div className={styles.selectRow}>
        <button className={styles.navigateButton} onClick={handleAdd}>
          Dodaj
        </button>
        <button
          className={styles.returnButton}
          onClick={() => navigate(`/librarian/books/${bookId}/copies`, { state: { bookName: bookName } } )}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default AddBookCopy;
