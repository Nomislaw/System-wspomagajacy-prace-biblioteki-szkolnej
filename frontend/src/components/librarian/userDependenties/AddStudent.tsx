import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { User } from "../../../types/Index";
import { SchoolClassService } from "../../../api/SchoolClassService";
import styles from "./../Librarian.module.css";

const AddStudent: React.FC = () => {
  const { id } = useParams(); 
  const classId = Number(id);
  const navigate = useNavigate();

  const location = useLocation();
  const { className } = location.state as { className: string };

  const [students, setStudents] = useState<User[]>([]);
  const [searchName, setSearchName] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await SchoolClassService.getStudents(0);
      setStudents(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClass = async (userId: number) => {


  try {
    await SchoolClassService.changeUserClass(userId,classId);
    fetchStudents();
    
  } catch (err) {
    console.error(err);
    alert("Wystąpił błąd podczas dodawania klasy ucznia");
  }
};

  useEffect(() => {
    if (classId) fetchStudents();
  }, [classId]);

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className={styles.container}>
        <div className={styles.headerSection}>
            <button
                className={styles.returnButton}
                onClick={() => navigate(`/librarian/school-classes/${classId}/students`, { state: { className: className}})}
            >
                Cofnij
            </button>
        </div>
      <h2 className={styles.title}>Dodaj uczniów do klasy {className}</h2>

      <input
        type="text"
        className={styles.input}
        placeholder="Szukaj po imieniu lub nazwisku..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Klasa</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Brak uczniów pasujących do wyszukiwania.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.className}</td>
                <td>
                    <button
                    className={styles.addButton}
                    onClick={() => handleAddClass(student.id)}
                    >
                    Dodaj
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddStudent;
