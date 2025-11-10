import React, { useState } from "react";
import { User } from "../../types/Index";
import { UserService } from "../../api/UserService";
import styles from "./Admin.module.css";
import { useNavigate } from "react-router-dom";

const AddUser: React.FC = () => {
  const [newUser, setNewUser] = useState<Partial<User>>({});
   const navigate = useNavigate();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
      alert("Wypełnij wszystkie pola: imię, nazwisko, email i hasło");
      return;
    }

    try {
      await UserService.addUser(newUser);
      alert("Użytkownik został dodany pomyślnie");
      setNewUser({});
      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Błąd podczas dodawania użytkownika");
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.addSection}>
          <button className={styles.returnButton} onClick={() => navigate("/admin/users")}>Cofnij</button>
          <h2 className={styles.title}>Dodaj nowego użytkownika</h2>
          <form onSubmit={handleAddUser} className={styles.form}>
            <input
              type="text"
              placeholder="Imię"
              value={newUser.firstName || ""}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nazwisko"
              value={newUser.lastName || ""}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email || ""}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Hasło"
              value={newUser.password || ""}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button className={styles.submit} type="submit">Dodaj użytkownika</button>
          </form>
        </div>
    </div>
    
  );
};

export default AddUser;
