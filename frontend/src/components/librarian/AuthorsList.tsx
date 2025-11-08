import React, { useEffect, useState } from "react";
import { AuthorService } from "../../api/AuthorService";
import { Author } from "../../types/Index";
import styles from "./Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AuthorsList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAuthor, setEditedAuthor] = useState<Author | null>(null);
  const [searchLastName, setSearchLastName] = useState(""); // 👈 nowe pole do wyszukiwania
  const navigate = useNavigate();

  const fetchAuthors = async () => {
    try {
      const res = await AuthorService.getAllAuthors();
      setAuthors(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania autorów");
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleEditClick = (author: Author) => {
    setEditingId(author.id);
    setEditedAuthor({ ...author });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedAuthor(null);
  };

  const handleSave = async (id: number) => {
    if (!editedAuthor) return;

    try {
      await AuthorService.updateAuthor(id, editedAuthor);
      setEditingId(null);
      setEditedAuthor(null);
      fetchAuthors();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania zmian");
    }
  };

  const handleChange = (field: keyof Author, value: string) => {
    if (!editedAuthor) return;
    setEditedAuthor({ ...editedAuthor, [field]: value });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć autora ${name}?`)) return;

    try {
      await AuthorService.deleteAuthor(id);
      alert(`Autor ${name} został usunięty.`);
      fetchAuthors();
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        alert(err.response.data.errors.join("\n"));
      } else {
        alert("Wystąpił błąd podczas usuwania autora.");
      }
    }
  };

  const filteredAuthors = authors.filter((a) =>
    a.lastName.toLowerCase().includes(searchLastName.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSection}>
          <button
            className={styles.navigateButton}
            onClick={() => navigate("/librarian/authors/add")}
          >
            Dodaj autora
          </button>
        </div>

        <h2 className={styles.title}>Lista autorów</h2>

        <input
            type="text"
            className={styles.input}
            placeholder="Szukaj po nazwisku..."
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
          />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Brak autorów pasujących do wyszukiwania.
                </td>
              </tr>
            ) : (
              filteredAuthors.map((author) => (
                <tr key={author.id}>
                  <td>{author.id}</td>
                  <td>
                    {editingId === author.id ? (
                      <input
                        type="text"
                        value={editedAuthor?.firstName || ""}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        className={styles.inputEdit}
                      />
                    ) : (
                      author.firstName
                    )}
                  </td>
                  <td>
                    {editingId === author.id ? (
                      <input
                        type="text"
                        value={editedAuthor?.lastName || ""}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        className={styles.inputEdit}
                      />
                    ) : (
                      author.lastName
                    )}
                  </td>
                  <td>
                    {editingId === author.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSave(author.id)}
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
                          onClick={() => handleEditClick(author)}
                        >
                          Edytuj
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() =>
                            handleDelete(
                              author.id,
                              author.firstName + " " + author.lastName
                            )
                          }
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

export default AuthorsList;
