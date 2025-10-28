import React, { useState } from "react";
import { UserService } from "../../api/UserService";
import { User } from "../../types/Index";
import styles from "./Password.module.css";

const Password: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const userData: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userId = userData?.id;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userId) {
      setMessage("Błąd: użytkownik niezalogowany.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Nowe hasła nie są takie same!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await UserService.updatePassword(userId, { oldPassword, newPassword });
      setMessage("Hasło zmienione pomyślnie!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.message || "Błąd serwera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Zmień hasło</h2>

      <input
        type="password"
        placeholder="Stare hasło"
        className={styles.inputField}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Nowe hasło"
        className={styles.inputField}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Potwierdź nowe hasło"
        className={styles.inputField}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Trwa zmiana..." : "Zmień hasło"}
      </button>

      {message && (
        <p className={`${styles.message} ${message.includes("pomyślnie") ? styles.success : ""}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Password;
