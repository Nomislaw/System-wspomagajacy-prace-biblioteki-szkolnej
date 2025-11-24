import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Role, User } from "../../../types/Index";
import { SchoolClassService } from "../../../api/SchoolClassService";
import styles from "./../Librarian.module.css";

const StudentsList: React.FC = () => {
  const mapUserRole = (role: Role): string => {
          switch (role) {
            case "Student":
              return "Uczeń"
            case "Teacher":
              return "Nauczyciel"
            default:
              return role;
          }
        };
        
  const { id } = useParams(); 
  const classId = Number(id);
  const navigate = useNavigate();

  const location = useLocation();
  const { className } = location.state as { className: string };

  const [students, setStudents] = useState<User[]>([]);
  const [searchName, setSearchName] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await SchoolClassService.getStudents(classId);
      setStudents(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveClass = async (userId: number) => {

  try {
    await SchoolClassService.changeUserClass(userId,undefined);
    fetchStudents();
    
  } catch (err) {
    console.error(err);
    alert("Wystąpił błąd podczas usuwania klasy ucznia");
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
        <div className={styles.headerSectionMoreItems}>
            <button
                className={styles.returnButton}
                onClick={() => navigate("/librarian/school-classes")}
            >
                Cofnij
            </button>
             <button
            className={styles.navigateButton}
            onClick={() => navigate(`/librarian/school-classes/${classId}/students/add`, { state: { className: className}})}
          >
            Dodaj użytkowników
          </button>
        </div>
      <h2 className={styles.title}>Użytkownicy klasy {className}</h2>

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
            <th>Rola</th>
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
                <td>{mapUserRole(student.role)}</td>
                <td>
                    <button
                    className={styles.deleteButton}
                    onClick={() => handleRemoveClass(student.id)}
                    >
                    Usuń
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

export default StudentsList;
