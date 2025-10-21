import React, { useState } from "react";
import { User } from "../types/Index";
import { login as loginAPI } from "../api/AuthService";
import "./Login.css";

interface LoginProps {
  onLogin: (user: User) => void;
  goToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, goToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginAPI(email, password);
      onLogin(user);
    } catch (err: any) {
      setError("Niepoprawny e-mail lub hasło");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>📚 Logowanie do Biblioteki</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Zaloguj</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p>
          Nie masz konta?{" "}
          <span
            className="link"
            onClick={goToRegister}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Zarejestruj się
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
