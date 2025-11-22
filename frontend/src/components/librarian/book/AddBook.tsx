import React, { useEffect, useState } from "react";
import { Book, Author, Category, Publisher } from "../../../types/Index";
import { BookService } from "../../../api/BookService";
import { AuthorService } from "../../../api/AuthorService";
import { CategoryService } from "../../../api/CategoryService";
import { PublisherService } from "../../../api/PublisherService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AddBook: React.FC = () => {
  const [newBook, setNewBook] = useState<Partial<Book>>({});
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddPublisher, setShowAddPublisher] = useState(false);

  const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "" });
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [newPublisher, setNewPublisher] = useState({ name: "" });

  const fetchData = async () => {
    try {
      const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
        AuthorService.getAllAuthors(),
        CategoryService.getAllCategories(),
        PublisherService.getAllPublishers(),
      ]);
      setAuthors(authorsRes);
      setCategories(categoriesRes);
      setPublishers(publishersRes);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania danych potrzebnych do dodania książki.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAuthor = async () => {
    if (!newAuthor.firstName || !newAuthor.lastName)
      return alert("Uzupełnij dane autora.");
    try {
      const created = await AuthorService.addAuthor(newAuthor);
      setAuthors([...authors, created]);
      setNewBook({ ...newBook, authorId: created.id });
      setShowAddAuthor(false);
      setNewAuthor({ firstName: "", lastName: "" });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania autora.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return alert("Podaj nazwę kategorii.");
    try {
      const created = await CategoryService.addCategory(newCategory);
      setCategories([...categories, created]);
      setNewBook({ ...newBook, categoryId: created.id });
      setShowAddCategory(false);
      setNewCategory({ name: "" });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania kategorii.");
    }
  };

  const handleAddPublisher = async () => {
    if (!newPublisher.name) return alert("Podaj nazwę wydawnictwa.");
    try {
      const created = await PublisherService.addPublisher(newPublisher);
      setPublishers([...publishers, created]);
      setNewBook({ ...newBook, publisherId: created.id });
      setShowAddPublisher(false);
      setNewPublisher({ name: "" });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania wydawnictwa.");
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newBook.title ||
      !newBook.publicationYear ||
      !newBook.isbn ||
      !newBook.authorId ||
      !newBook.categoryId ||
      !newBook.publisherId ||
      !newBook.description
    ) {
      alert("Wypełnij wszystkie pola formularza.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await BookService.addBook(newBook);
      alert("Książka została dodana pomyślnie!");
      setNewBook({});
      navigate("/librarian/books");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Błąd podczas dodawania książki.");
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

        <h2 className={styles.title}>Dodaj nową książkę</h2>

        <form onSubmit={handleAddBook} className={styles.form}>
          <input
            type="text"
            placeholder="Tytuł książki"
            value={newBook.title || ""}
            onChange={(e) =>
              setNewBook({ ...newBook, title: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Rok wydania"
            value={newBook.publicationYear || ""}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                publicationYear: Number(e.target.value),
              })
            }
          />

          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn || ""}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
          />

      

          <div className={styles.selectRow}>
            <select
              className={styles.select}
              value={newBook.authorId || ""}
              onChange={(e) =>
                setNewBook({ ...newBook, authorId: Number(e.target.value) })
              }
            >
              <option value="">Wybierz autora</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName}
                </option>
              ))}
            </select>
            <button className={styles.addButton} type="button" onClick={() => setShowAddAuthor(true)}>
              Dodaj
            </button>
          </div>

          <div className={styles.selectRow}>
            <select
              className={styles.select}
              value={newBook.categoryId || ""}
              onChange={(e) =>
                setNewBook({ ...newBook, categoryId: Number(e.target.value) })
              }
            >
              <option value="">Wybierz kategorię</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className={styles.addButton} type="button" onClick={() => setShowAddCategory(true)}>
              Dodaj
            </button>
          </div>

          <div className={styles.selectRow}>
            <select
              className={styles.select}
              value={newBook.publisherId || ""}
              onChange={(e) =>
                setNewBook({ ...newBook, publisherId: Number(e.target.value) })
              }
            >
              <option value="">Wybierz wydawnictwo</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button className={styles.addButton} type="button" onClick={() => setShowAddPublisher(true)}>
              Dodaj
            </button>
          </div>

          <textarea
              placeholder="Opis książki"
              value={newBook.description || ""}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
              className={styles.textarea}
            />

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." : "Dodaj książkę"}
          </button>
        </form>
      </div>


      {showAddAuthor && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.title}>Dodaj autora</h3>
            <input
              className={styles.inputEdit}
              type="text"
              placeholder="Imię"
              value={newAuthor.firstName}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, firstName: e.target.value })
              }
            />
            <input
              className={styles.inputEdit}
              type="text"
              placeholder="Nazwisko"
              value={newAuthor.lastName}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, lastName: e.target.value })
              }
            />
            <button className={styles.addButton} onClick={handleAddAuthor}>Zapisz</button>
            <button className={styles.cancelButton} onClick={() => setShowAddAuthor(false)}>Anuluj</button>
          </div>
        </div>
      )}

      {showAddCategory && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.title}>Dodaj kategorię</h3>
            <input
              className={styles.inputEdit}
              type="text"
              placeholder="Nazwa kategorii"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
            />
            <button className={styles.addButton} onClick={handleAddCategory}>Zapisz</button>
            <button className={styles.cancelButton} onClick={() => setShowAddCategory(false)}>Anuluj</button>
          </div>
        </div>
      )}

      {showAddPublisher && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.title}>Dodaj wydawnictwo</h3>
            <input
              className={styles.inputEdit}
              type="text"
              placeholder="Nazwa wydawnictwa"
              value={newPublisher.name}
              onChange={(e) => setNewPublisher({ name: e.target.value })}
            />
            <button className={styles.addButton} onClick={handleAddPublisher}>Zapisz</button>
            <button className={styles.cancelButton} onClick={() => setShowAddPublisher(false)}>Anuluj</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;
