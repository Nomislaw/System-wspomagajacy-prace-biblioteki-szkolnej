import React, { useState } from "react";
import { Publisher } from "../../../types/Index";
import { PublisherService } from "../../../api/PublisherService";
import styles from "./../Librarian.module.css";
import { useNavigate } from "react-router-dom";

const AddPublisher: React.FC = () => {
  const [newPublisher, setNewPublisher] = useState<Partial<Publisher>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAddPublisher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!newPublisher.name) {
      alert("Wpisz nazwę wydawnictwa");
      return;
    }

    setIsSubmitting(true);
    try {
      await PublisherService.addPublisher(newPublisher);
      alert("Wydawnictwo zostało dodane pomyślnie");
      setNewPublisher({});
      navigate("/librarian/publishers");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Błąd podczas dodawania wydawnictwa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.addSection}>
        <button
          className={styles.returnButton}
          onClick={() => navigate("/librarian/publishers")}
        >
          Cofnij
        </button>
        <h2 className={styles.title}>Dodaj nowe wydawnictwo</h2>
        <form onSubmit={handleAddPublisher} className={styles.form}>
          <input
            type="text"
            placeholder="Nazwa wydawnictwa"
            value={newPublisher.name || ""}
            onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
            disabled={isSubmitting}
          />
          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj wydawnictwo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPublisher;
