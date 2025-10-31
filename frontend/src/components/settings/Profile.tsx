import React, { useState, useEffect } from "react";
import { UserService } from "../../api/UserService";
import { User, UpdateUserDto } from "../../types/Index";
import styles from "./Profile.module.css"; 

const Profile: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const userData: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userId = userData?.id;

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<UpdateUserDto>({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setMessage("Nie znaleziono użytkownika. Zaloguj się ponownie.");
        setLoading(false);
        return;
      }

      try {
        const fetchedUser = await UserService.getProfile(userId);
        setUser(fetchedUser);
        setForm({
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email
        });
      } catch (err: any) {
        setMessage("Nie udało się pobrać danych użytkownika.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const updatedUser = await UserService.updateProfile(userId, form);
      setUser({ ...updatedUser, password: "" });
      setMessage("Profil zaktualizowany pomyślnie!");
      setIsEditing(false);
    } catch (err: any) {
      setMessage("Adres e-mail jest zajęty.");
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (!user) return <p>Nie znaleziono użytkownika.</p>;

  return (
    <div className={styles.container}>
  <h2 className={styles.title}>Profil użytkownika</h2>

  {!isEditing ? (
    <>
        <div className={styles.profileCard}>
        <div className={styles.profileField}>
          <span className={styles.label}>Imię:</span>
          <span className={styles.value}>{user.firstName}</span>
        </div>

        <div className={styles.profileField}>
          <span className={styles.label}>Nazwisko:</span>
          <span className={styles.value}>{user.lastName}</span>
        </div>

        <div className={styles.profileField}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user.email}</span>
        </div>

        <button className={styles.editButton} onClick={handleEditClick}>Edytuj</button>
        </div>
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Imię:</label>
        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label>Nazwisko:</label>
        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label>Email:</label>
        <input type="email" name="email" value={form.email} readOnly onChange={handleChange} required />
      </div>

      <button type="submit" className={styles.button}>Zapisz zmiany</button>
      <button type="button" className={styles.button} onClick={handleCancelClick}>Anuluj</button>
    </form>
  )}

  {message && (
    <p className={`${styles.message} ${message.includes("pomyślnie") ? styles.success : ""}`}>
      {message}
    </p>
  )}
</div>
  );
};

export default Profile;
