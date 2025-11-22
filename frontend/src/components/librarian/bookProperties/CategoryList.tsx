import React, { useEffect, useState } from "react";
import { Category } from "../../../types/Index";
import { CategoryService } from "../../../api/CategoryService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState<Partial<Category> | null>(null);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAllCategories();
      setCategories(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania kategorii");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditedCategory({ ...category });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCategory(null);
  };

  const handleSave = async (id: number) => {
    if (!editedCategory) return;
    try {
      await CategoryService.updateCategory(id, editedCategory);
      setEditingId(null);
      setEditedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania zmian");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć kategorię ${name}?`)) return;
    try {
      await CategoryService.deleteCategory(id);
      alert(`Kategoria ${name} została usunięta.`);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        alert(err.response.data.errors.join("\n"));
      } else {
        alert("Wystąpił błąd podczas usuwania kategorii.");
      }
    }
  };

  const handleChange = (field: keyof Category, value: string) => {
    if (!editedCategory) return;
    setEditedCategory({ ...editedCategory, [field]: value });
  };

  const filtered = categories
    .filter((c) => c.name.toLowerCase().includes(searchName.toLowerCase()))
    ;

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSection}>
          <button
            className={styles.navigateButton}
            onClick={() => navigate("/librarian/categories/add")}
          >
            Dodaj kategorię
          </button>

        </div>

        <h2 className={styles.title}>Lista kategorii</h2>
        <input
            type="text"
            className={styles.input}
            placeholder="Szukaj po nazwie..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Brak kategorii pasujących do wyszukiwania.
                </td>
              </tr>
            ) : (
              filtered.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editedCategory?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={styles.inputEdit}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td>
                    {editingId === cat.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSave(cat.id)}
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
                          onClick={() => handleEditClick(cat)}
                        >
                          Edytuj
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(cat.id, cat.name)}
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

export default CategoryList;
