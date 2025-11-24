import React, { useEffect, useState } from "react";
import { SchoolClassService } from "../../../api/SchoolClassService";
import { SchoolClass } from "../../../types/Index";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const SchoolClassesList: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedClass, setEditedClass] = useState<SchoolClass | null>(null);
  const [searchName, setSearchName] = useState(""); 
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await SchoolClassService.getAllClasses();
      setClasses(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania klas");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEditClick = (schoolClass: SchoolClass) => {
    setEditingId(schoolClass.id);
    setEditedClass({ ...schoolClass });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedClass(null);
  };

  const handleSave = async (id: number) => {
    if (!editedClass) return;

    try {
      await SchoolClassService.updateClass(id, editedClass);
      setEditingId(null);
      setEditedClass(null);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania zmian");
    }
  };

  const handleChange = (field: keyof SchoolClass, value: string) => {
    if (!editedClass) return;
    setEditedClass({ ...editedClass, [field]: value });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć klasę ${name}?`)) return;

    try {
      await SchoolClassService.deleteClass(id);
      alert(`Klasa ${name} została usunięta.`);
      fetchClasses();
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        alert(err.response.data.errors.join("\n"));
      } else {
        alert("Wystąpił błąd podczas usuwania klasy.");
      }
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.className.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSection}>
          <button
            className={styles.navigateButton}
            onClick={() => navigate("/librarian/school-classes/add")}
          >
            Dodaj klasę
          </button>
        </div>

        <h2 className={styles.title}>Lista klas szkolnych</h2>

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
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Brak klas pasujących do wyszukiwania.
                </td>
              </tr>
            ) : (
              filteredClasses.map((schoolClass) => (
                <tr key={schoolClass.id}>
                  <td>{schoolClass.id}</td>
                  <td>
                    {editingId === schoolClass.id ? (
                      <input
                        type="text"
                        value={editedClass?.className || ""}
                        onChange={(e) =>
                          handleChange("className", e.target.value)
                        }
                        className={styles.inputEdit}
                      />
                    ) : (
                      schoolClass.className
                    )}
                  </td>
                  <td>
                    {editingId === schoolClass.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSave(schoolClass.id)}
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
                          className={styles.copyButton}
                          onClick={() => navigate(`/librarian/school-classes/${schoolClass.id}/students`, { state: { className: schoolClass.className}})}
                        >
                          Użytkownicy
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(schoolClass)}
                        >
                          Edytuj
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() =>
                            handleDelete(schoolClass.id, schoolClass.className)
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

export default SchoolClassesList;
