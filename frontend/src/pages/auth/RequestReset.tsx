import { useState } from "react";
import { fetchAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("Jeżeli użytkownik istnieje, wysłaliśmy link do resetu hasła.");
      setEmail("");
      navigate("/login")
    } catch {
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Resetowanie hasła</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Twój email"
          required
        />
        <button type="submit">Wyślij link</button>
      </form>
      {message && (
        <p className={message.includes("Wystąpił") ? "error" : "success"}>
          {message}
        </p>
      )}
    </div>
  </div>
);

}
