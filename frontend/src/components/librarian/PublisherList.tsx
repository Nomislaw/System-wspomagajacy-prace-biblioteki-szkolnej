import React, { useEffect, useState } from "react";
import { Publisher } from "../../types/Index";
import { PublisherService } from "../../api/PublisherService";
import styles from "./Librarian.module.css";
import { useNavigate } from "react-router-dom";

const PublisherList: React.FC = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedPublisher, setEditedPublisher] = useState<Partial<Publisher> | null>(null);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  const fetchPublishers = async () => {
    try {
      const res = await PublisherService.getAllPublishers();
      setPublishers(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania wydawnictw");
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleEditClick = (publisher: Publisher) => {
    setEditingId(publisher.id);
    setEditedPublisher({ ...publisher });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPublisher(null);
  };

  const handleSave = async (id: number) => {
    if (!editedPublisher) return;
    try {
      await PublisherService.updatePublisher(id, editedPublisher);
      setEditingId(null);
      setEditedPublisher(null);
      fetchPublishers();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania zmian");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć wydawnictwo ${name}?`)) return;
    try {
      await PublisherService.deletePublisher(id);
      alert(`Wydawnictwo ${name} zostało usunięte.`);
      fetchPublishers();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        alert(err.response.data.errors.join("\n"));
      } else {
        alert("Wystąpił błąd podczas usuwania wydawnictwa.");
      }
    }
  };

  const handleChange = (field: keyof Publisher, value: string) => {
    if (!editedPublisher) return;
    setEditedPublisher({ ...editedPublisher, [field]: value });
  };

  const filtered = publishers
    .filter((p) => p.name.toLowerCase().includes(searchName.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <div className={styles.headerSection}>
          <button
            className={styles.navigateButton}
            onClick={() => navigate("/librarian/publishers/add")}
          >
            Dodaj wydawnictwo
          </button>
          
        </div>

        <h2 className={styles.title}>Lista wydawnictw</h2>
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
                  Brak wydawnictw pasujących do wyszukiwania.
                </td>
              </tr>
            ) : (
              filtered.map((pub) => (
                <tr key={pub.id}>
                  <td>{pub.id}</td>
                  <td>
                    {editingId === pub.id ? (
                      <input
                        type="text"
                        value={editedPublisher?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={styles.inputEdit}
                      />
                    ) : (
                      pub.name
                    )}
                  </td>
                  <td>
                    {editingId === pub.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSave(pub.id)}
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
                          onClick={() => handleEditClick(pub)}
                        >
                          Edytuj
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(pub.id, pub.name)}
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

export default PublisherList;
