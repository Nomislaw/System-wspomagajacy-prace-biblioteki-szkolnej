import React, { useEffect, useState } from "react";
import { UserService } from "../../api/UserService";
import { User, Role } from "../../types/Index";
import styles from "./Admin.module.css";
import { useNavigate } from "react-router-dom";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await UserService.getAllUsers();
      setUsers(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania użytkowników");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (id: number, role: Role) => {
    try {
      await UserService.changeUserRole(id, role);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zmiany roli");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (user.role === "Administrator") {
      alert("Nie można usunąć użytkownika z rolą Administrator");
      return;
    }

    if (!window.confirm("Na pewno chcesz usunąć użytkownika?")) return;

    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania użytkownika");
    }
  };

  const handleActiveUser = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (!window.confirm("Na pewno chcesz aktywować to konto?")) return;

    try {
      await UserService.activeUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas aktywowania użytkownika");
    }
  };

  const handleSendTokenToUser = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (!window.confirm("Na pewno chcesz wysłać token do użytkownika?")) return;

    try {
      await UserService.sendTokenToUser(id);
      alert("Wysłano token pomyślnie!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wysyłania tokenu do użytkownika");
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.userListSection}>
          <button className={styles.navigateButton} onClick={() => navigate("/admin/users/add")}>Dodaj użytkownika</button>
          <h2 className={styles.title}>Lista użytkowników</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Rola</th>
                <th>Usuń</th>
                <th>Aktywacja konta</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <select
                      className={styles.select}
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as Role)}
                      disabled={user.id === currentUser?.id}
                    >
                      <option value="User">User</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === "Administrator"}
                      style={{ cursor: user.role === "Administrator" ? "not-allowed" : "pointer" }}>
                      Usuń
                    </button>
                  </td>
                  <td>

                     {(user.emailConfirmed === false) && (
                    <button
                      className={styles.activeButton}
                      onClick={() => handleActiveUser(user.id)}>
                      Aktywuj
                    </button>
                  )}
                   {(user.emailConfirmed === false) && (
                  <button
                      className={styles.activeButton}
                      onClick={() => handleSendTokenToUser(user.id)}>
                      Wyślij token
                    </button>
                   )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default UsersList;
