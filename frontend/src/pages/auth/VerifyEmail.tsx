import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


interface VerifyEmailProps{
    goToLogin: () => void;
}

const VerifyEmail : React.FC<VerifyEmailProps> = ({ goToLogin }) => {
  const [status, setStatus] = useState("Trwa weryfikacja...");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const API_URL = "https://localhost:44389/api";

  useEffect(() => {
  const token = params.get("token");
  console.log("Token z URL:", token);

  if (!token) {
    setStatus("Brak tokenu weryfikacyjnym.");
    return;
  }

  fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`)
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText); 
      }
      const data = await res.text(); 
      console.log("Response:", data);
      setStatus("✅ E-mail został pomyślnie zweryfikowany!");
      goToLogin();
    })
    .catch((err) => {
      console.error("Błąd fetch:", err);
      setStatus("❌ Niepoprawny lub nieaktywny token.");
    });
}, [params,navigate]);


  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
