import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolClassService } from "../../../api/SchoolClassService";
import styles from "./../Librarian.module.css";

const AddSchoolClass: React.FC = () => {
  const navigate = useNavigate();
  const [className, setName] = useState("");

  const handleAdd = async () => {
    if (!className) {
      alert("Podaj nazwę klasy!");
      return;
    }

    try {
      await SchoolClassService.addClass({ className });
      navigate("/librarian/school-classes");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania klasy.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Dodaj klasę szkolną</h2>

      <input
        type="text"
        className={styles.input}
        placeholder="Nazwa klasy"
        value={className}
        onChange={(e) => setName(e.target.value)}
      />

      <div className={styles.selectRow}>
        <button className={styles.navigateButton} onClick={handleAdd}>
          Dodaj
        </button>
        <button
          className={styles.returnButton}
          onClick={() => navigate("/librarian/school-classes")}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default AddSchoolClass;
