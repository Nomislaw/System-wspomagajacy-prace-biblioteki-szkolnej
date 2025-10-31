import { useState } from "react";
import { fetchAPI } from "../../api/api";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Brak tokenu w URL.");
      setSuccess("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Hasła nie są takie same.");
      setSuccess("");
      return;
    }

    try {
      await fetchAPI("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess("Hasło zostało zresetowane. Możesz się teraz zalogować.");
      setError("");
      setNewPassword("");
      setConfirmPassword("");
    } catch(err:any) {
      setError(err.message || "Błąd serwera");
      setSuccess("");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Ustaw nowe hasło</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Nowe hasło"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Powtórz hasło"
          required
        />
        <button type="submit">Zresetuj hasło</button>
      </form>
      {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
    </div>
  </div>
);

}
