import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Author, Category, Publisher } from "../../types/Index";
import { BookService } from "../../api/BookService";
import { AuthorService } from "../../api/AuthorService";
import { CategoryService } from "../../api/CategoryService";
import { PublisherService } from "../../api/PublisherService";
import styles from "./Librarian.module.css";

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookData, setBookData] = useState<Partial<Book>>({});
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // pobranie danych książki i list pomocniczych
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, authorsRes, categoriesRes, publishersRes] = await Promise.all([
          BookService.getBookById(Number(id)),
          AuthorService.getAllAuthors(),
          CategoryService.getAllCategories(),
          PublisherService.getAllPublishers(),
        ]);
        setBookData(bookRes);
        setAuthors(authorsRes);
        setCategories(categoriesRes);
        setPublishers(publishersRes);
      } catch (err) {
        console.error(err);
        alert("Błąd podczas pobierania danych książki.");
      }
    };
    fetchData();
  }, [id]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !bookData.title ||
      !bookData.publicationYear ||
      !bookData.isbn ||
      !bookData.quantity ||
      !bookData.authorId ||
      !bookData.categoryId ||
      !bookData.publisherId
    ) {
      alert("Wypełnij wszystkie pola formularza.");
      return;
    }

    setIsSubmitting(true);
    try {
      await BookService.updateBook(Number(id), bookData);
      alert("Dane książki zostały zaktualizowane.");
      navigate("/librarian/books");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania zmian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.addSection}>
        <button
          className={styles.returnButton}
          onClick={() => navigate("/librarian/books")}
        >
          Cofnij
        </button>

        <h2 className={styles.title}>Edytuj książkę</h2>

        <form onSubmit={handleSaveChanges} className={styles.form}>
          <input
            type="text"
            placeholder="Tytuł książki"
            value={bookData.title || ""}
            onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
          />

          <input
            type="number"
            placeholder="Rok wydania"
            value={bookData.publicationYear || ""}
            onChange={(e) =>
              setBookData({
                ...bookData,
                publicationYear: Number(e.target.value),
              })
            }
          />

          <input
            type="text"
            placeholder="ISBN"
            value={bookData.isbn || ""}
            onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
          />

          <input
            type="number"
            placeholder="Ilość egzemplarzy"
            value={bookData.quantity || ""}
            onChange={(e) =>
              setBookData({ ...bookData, quantity: Number(e.target.value) })
            }
          />

          <select
            className={styles.select}
            value={bookData.authorId || ""}
            onChange={(e) =>
              setBookData({ ...bookData, authorId: Number(e.target.value) })
            }
          >
            <option value="">Wybierz autora</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={bookData.categoryId || ""}
            onChange={(e) =>
              setBookData({ ...bookData, categoryId: Number(e.target.value) })
            }
          >
            <option value="">Wybierz kategorię</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={bookData.publisherId || ""}
            onChange={(e) =>
              setBookData({ ...bookData, publisherId: Number(e.target.value) })
            }
          >
            <option value="">Wybierz wydawnictwo</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
