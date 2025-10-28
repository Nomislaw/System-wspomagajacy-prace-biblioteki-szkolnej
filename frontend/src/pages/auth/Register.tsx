import React, { useState } from "react";
import { register as registerAPI } from "../../api/AuthService";
import "./index.css";

interface RegisterProps {
  onRegister: () => void;
  goToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, goToLogin }) => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
  onRegister();
} catch (err: any) {
  
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

        <p>
          Masz już konto?{" "}
          <span className="link" onClick={goToLogin} style={{ cursor: "pointer", color: "blue" }}>Zaloguj się</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
