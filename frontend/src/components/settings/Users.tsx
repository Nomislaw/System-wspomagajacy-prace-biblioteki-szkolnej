import React, { useEffect, useState } from "react";
import { UserService } from "../../api/UserService";
import { User, Role } from "../../types/Index";
import styles from "./Users.module.css"; 

const Users: React.FC = () => {
    const [currentUser] = useState<User | null>(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [view, setView] = useState<"list" | "add">("list");

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

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
        alert("Wypełnij wszystkie pola: email, imię, nazwisko i hasło");
        return;
      }
      await UserService.addUser(newUser);
      setNewUser({});
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

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
    const user = users.find(u => u.id === id);
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

  return (
  <div className={styles.container}>
    <h2 className={styles.title}>Panel administratora</h2>

    <div className={styles.viewButtons}>
      <button onClick={() => setView("list")} disabled={view === "list"}>Lista użytkowników</button>
      <button onClick={() => setView("add")} disabled={view === "add"}>Dodaj użytkownika</button>
    </div>

    {view === "add" && (
      <div className={styles.addUserSection}>
        <h3>Dodaj nowego użytkownika</h3>      
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
          type="text"
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
        <button onClick={handleAddUser}>Dodaj</button>
      </div>
    )}

    {view === "list" && (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Rola</th>
            <th>Akcje</th>
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
                  className={styles.roleSelect}
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
                  style={{ cursor: user.role === "Administrator" ? "not-allowed" : "pointer" }}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};

export default Users;
