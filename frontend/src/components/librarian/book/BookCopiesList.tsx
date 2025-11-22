import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BookCopy, Book } from "../../../types/Index";
import { BookCopyService } from "../../../api/BookCopyService";
import styles from "./../Librarian.module.css";



const BookCopiesList: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const { bookName } = location.state as { bookName: string };

  const [copies, setCopies] = useState<BookCopy[]>([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedBarcode, setEditedBarcode] = useState("");

  const fetchData = async () => {
    try {
      if (!id) return;
      const copyRes = await BookCopyService.getCopiesByBookId(Number(id));
      setCopies(copyRes);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania egzemplarzy książki");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (copyId: number) => {
    if (!window.confirm("Na pewno chcesz usunąć ten egzemplarz?")) return;

    try {
      await BookCopyService.deleteCopy(copyId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Nie można usunąć egzemplarza (może jest wypożyczony).");
    }
  };

  const handleEditClick = (copy: BookCopy) => {
    setEditingId(copy.id);
    setEditedBarcode(copy.barCode);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedBarcode("");
  };

  const handleSave = async (copyId: number) => {
    if (!editedBarcode) {
      alert("Podaj kod kreskowy!");
      return;
    }

    try {
      await BookCopyService.updateCopy(copyId, {
        bookId: Number(id),
        barCode: editedBarcode,
      });
      setEditingId(null);
      setEditedBarcode("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        alert(err.response.data.errors.join("\n"));
      } else {
        alert("Błąd podczas zapisywania zmian");
      }
    }
  };

  const filteredCopies = copies.filter((c) =>
    c.barCode.toLowerCase().includes(searchBarcode.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSectionMoreItems}>
          <button
            className={styles.returnButton}
            onClick={() => navigate("/librarian/books")}
          >
            Cofnij
          </button>
          <button
            className={styles.navigateButton}
            onClick={() => navigate(`/librarian/books/${id}/copies/add`, { state: { bookName: bookName } })}
          >
            Dodaj egzemplarz
          </button>
        </div>

        <h2 className={styles.title}>Lista egzemplarzy — {bookName}</h2>

        <input
          type="text"
          className={styles.input}
          placeholder="Szukaj po kodzie kreskowym..."
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.target.value)}
        />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kod kreskowy</th>
              <th>Dostępność</th>
              <th>Akcje</th>
            </tr>
          </thead>

          <tbody>
            {filteredCopies.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Brak egzemplarzy spełniających kryteria.
                </td>
              </tr>
            ) : (
              filteredCopies.map((copy) => (
                <tr key={copy.id}>
                  <td>{copy.id}</td>
                  <td>
                    {editingId === copy.id ? (
                      <input
                        type="text"
                        value={editedBarcode}
                        onChange={(e) => setEditedBarcode(e.target.value)}
                        className={styles.inputEdit}
                      />
                    ) : (
                      copy.barCode
                    )}
                  </td>
                  <td>{copy.isAvailable ? "Dostępny" : "Niedostępny"}</td>
                  <td>
                    {editingId === copy.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSave(copy.id)}
                        >
                          Zapisz
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={handleCancel}
                        >
                          Anuluj
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(copy)}
                        >
                          Edytuj
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(copy.id)}
                        >
                          Usuń
                        </button>
                      </>
                    )}
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

export default BookCopiesList;
