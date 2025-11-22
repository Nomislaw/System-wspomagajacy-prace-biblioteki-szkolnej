import React, { useState } from "react";
import { Category } from "../../../types/Index";
import { CategoryService } from "../../../api/CategoryService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AddCategory: React.FC = () => {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!newCategory.name) {
      alert("Wpisz nazwę kategorii");
      return;
    }

    setIsSubmitting(true);
    try {
      await CategoryService.addCategory(newCategory);
      alert("Kategoria została dodana pomyślnie");
      setNewCategory({});
      navigate("/librarian/categories");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Błąd podczas dodawania kategorii");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.addSection}>
        <button
          className={styles.returnButton}
          onClick={() => navigate("/librarian/categories")}
        >
          Cofnij
        </button>
        <h2 className={styles.title}>Dodaj nową kategorię</h2>
        <form onSubmit={handleAddCategory} className={styles.form}>
          <input
            type="text"
            placeholder="Nazwa kategorii"
            value={newCategory.name || ""}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            disabled={isSubmitting}
          />
          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj kategorię"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
