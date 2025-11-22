import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Author, Category, Publisher } from "../../../types/Index";
import { BookService } from "../../../api/BookService";
import { AuthorService } from "../../../api/AuthorService";
import { CategoryService } from "../../../api/CategoryService";
import { PublisherService } from "../../../api/PublisherService";
import styles from "./../Librarian.module.css";

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookData, setBookData] = useState<Partial<Book>>({});
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [showAddAuthor, setShowAddAuthor] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddPublisher, setShowAddPublisher] = useState(false);
  
    const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "" });
    const [newCategory, setNewCategory] = useState({ name: "" });
    const [newPublisher, setNewPublisher] = useState({ name: "" });
  
    const handleAddAuthor = async () => {
        if (!newAuthor.firstName || !newAuthor.lastName)
          return alert("Uzupełnij dane autora.");
        try {
          const created = await AuthorService.addAuthor(newAuthor);
          setAuthors([...authors, created]);
          setBookData({ ...bookData, authorId: created.id });
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
          setBookData({ ...bookData, categoryId: created.id });
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
          setBookData({ ...bookData, publisherId: created.id });
          setShowAddPublisher(false);
          setNewPublisher({ name: "" });
        } catch (err) {
          console.error(err);
          alert("Błąd podczas dodawania wydawnictwa.");
        }
      };


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
      !bookData.authorId ||
      !bookData.categoryId ||
      !bookData.publisherId ||
      !bookData.description
    ) {
      alert("Wypełnij wszystkie pola formularza.");
      return;
    }

    setIsSubmitting(true);
    try {
      await BookService.updateBook(Number(id), bookData);
      alert("Dane książki zostały zaktualizowane.");
      navigate("/librarian/books");
    } catch (err :any) {
      console.error(err);
      alert(err.message || "Błąd podczas zapisywania zmian.");
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

          
            <div className={styles.selectRow}>
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

          <button className={styles.addButton} type="button" onClick={() => setShowAddAuthor(true)}>
              Dodaj
            </button>
            </div>
            
            <div className={styles.selectRow}>
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

          <button className={styles.addButton} type="button" onClick={() => setShowAddCategory(true)}>
              Dodaj
            </button>
            </div>

           <div className={styles.selectRow}>
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
          <button className={styles.addButton} type="button" onClick={() => setShowAddPublisher(true)}>
              Dodaj
            </button>
            </div>

            <textarea
              placeholder="Opis książki"
              value={bookData.description || ""}
              onChange={(e) =>
                setBookData({ ...bookData, description: e.target.value })
              }
              className={styles.textarea}
            />

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
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

export default EditBook;
