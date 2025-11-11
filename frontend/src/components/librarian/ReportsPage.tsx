import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportService } from "../../api/ReportService";
import { UserService } from "../../api/UserService";
import { User, Borrow, Reservation } from "../../types/Index";
import "../../fonts/FreeSans-normal"; 
import styles from "./Librarian.module.css";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

const ReportsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | number>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    UserService.getAllUsers().then(setUsers);
  }, []);

  const handleGenerate = async () => {
    if (!from || !to) {
      alert("Podaj zakres dat!");
      return;
    }
    try {
      const data = await ReportService.getUserReport(
        from,
        to,
        userId === "all" ? undefined : userId
      );
      if (!data) {
        alert("Brak danych do wygenerowania raportu.");
        return;
      }
      setReportData(data);
      generatePDF(data);
    } catch (error) {
      alert("Wystąpił błąd podczas pobierania raportu.");
      console.error(error);
    }
  };

  const generatePDF = (data: any) => {
    const doc = new jsPDF();
    doc.setFont("FreeSans", "normal");

    const title =
      `Raport wypożyczeń i rezerwacji - ${data.userName ?? "Wszyscy użytkownicy"}`;
    const subtitle =
      `Okres: ${new Date(data.fromDate).toLocaleDateString()} - ${new Date(data.toDate).toLocaleDateString()}`;

    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(subtitle, 14, 25);

    doc.text("Wypożyczenia", 14, 35);
    if (data.borrows.length > 0) {
      autoTable(doc, {
        startY: 40,
        head: [["Tytuł", "Użytkownik", "Data wypożyczenia", "Data zwrotu", "Status"]],
        body: data.borrows.map((b: Borrow) => [
          b.bookTitle,
          b.userName,
          new Date(b.borrowDate).toLocaleDateString(),
          b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "—",
          b.borrowStatus,
        ]),
        styles: { font: "FreeSans", fontStyle: "normal", cellPadding: 2 },
        headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
      });
    } else {
      doc.text("Brak danych o wypożyczeniach.", 14, 45);
    }

    const yPos = (doc.lastAutoTable?.finalY ?? 60) + 10;
    doc.text("Rezerwacje", 14, yPos);

    if (data.reservations.length > 0) {
      autoTable(doc, {
        startY: yPos + 5,
        head: [["Tytuł", "Użytkownik", "Data rezerwacji", "Data wygaśnięcia", "Status"]],
        body: data.reservations.map((r: Reservation) => [
          r.bookTitle,
          r.userName,
          new Date(r.reservationDate).toLocaleDateString(),
          new Date(r.expirationDate).toLocaleDateString(),
          r.reservationStatus,
        ]),
        styles: { font: "FreeSans", fontStyle: "normal", cellPadding: 2 },
        headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
      });
    } else {
      doc.text("Brak danych o rezerwacjach.", 14, yPos + 10);
    }

    doc.save(
      `Raport_${data.userName || "wszyscy"}_${new Date(data.fromDate).toISOString().substring(0, 10)}-${new Date(data.toDate).toISOString().substring(0, 10)}.pdf`
    );
  };

  return (
   <div className={styles.container}>
  <h2 className={styles.title}>Generowanie raportu</h2>

  <div className={styles.addSection}>
    <div>
      <label>Od:</label>
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className={styles.input}
      />
    </div>

    <div>
      <label>Do:</label>
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className={styles.input}
      />
    </div>

    <div>
      <label>Użytkownik:</label>
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className={styles.select}
      >
        <option value="all">Wszyscy</option>
        {users.map((u: User) => (
          <option key={u.id} value={u.id}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>
    </div>

    <button onClick={handleGenerate} className={styles.submit}>
      Generuj raport PDF
    </button>
  </div>
</div>

  );
};

export default ReportsPage;
