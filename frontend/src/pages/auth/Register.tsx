import React, { useState } from "react";
import { register as registerAPI } from "../../api/AuthService";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  if (password !== confirmPassword) {
    setError("Hasła muszą być identyczne");
    setLoading(false);
    return;
  }

try {
  const user = await registerAPI({ password, firstName, lastName, email });
  setError("");
  setFirstName("");
  setLastName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
  setSuccess("Zarejestrowano pomyślnie! Sprawdź swoją skrzynkę, aby potwierdzić e-mail.");
} catch (err: any) {
  setSuccess("");
  setError(err.message || "Błąd serwera.");
} finally {
  setLoading(false);
}
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Rejestracja</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Imię" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Nazwisko" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Powtórz hasło" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? "Rejestrowanie..." : "Zarejestruj"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <p>
          Masz już konto?{" "}
          <span className="link" onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>Zaloguj się</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
