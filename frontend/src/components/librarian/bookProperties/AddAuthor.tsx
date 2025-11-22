import React, { useState } from "react";
import { Author } from "../../../types/Index";
import { AuthorService } from "../../../api/AuthorService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AddAuthor: React.FC = () => {
  const [newAuthor, setNewAuthor] = useState<Partial<Author>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; 

    if (!newAuthor.firstName || !newAuthor.lastName) {
      alert("Wypełnij wszystkie pola: imię i nazwisko autora");
      return;
    }

    setIsSubmitting(true); 

    try {
      await AuthorService.addAuthor(newAuthor);
      alert("Autor został dodany pomyślnie");
      setNewAuthor({});
      navigate("/librarian/authors");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Błąd podczas dodawania autora");
    } finally {
      setIsSubmitting(false); 
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.addSection}>
        <button
          className={styles.returnButton}
          onClick={() => navigate("/librarian/authors")}
        >
          Cofnij
        </button>
        <h2 className={styles.title}>Dodaj nowego autora</h2>
        <form onSubmit={handleAddAuthor} className={styles.form}>
          <input
            type="text"
            placeholder="Imię autora"
            value={newAuthor.firstName || ""}
            onChange={(e) =>
              setNewAuthor({ ...newAuthor, firstName: e.target.value })
            }
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Nazwisko autora"
            value={newAuthor.lastName || ""}
            onChange={(e) =>
              setNewAuthor({ ...newAuthor, lastName: e.target.value })
            }
            disabled={isSubmitting}
          />
          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj autora"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;
