import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportService } from "../../api/ReportService";
import { UserService } from "../../api/UserService";
import "../../fonts/FreeSans-normal";
import styles from "./../librarian/Librarian.module.css";
import { User } from "../../types/Index";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

const ReportPageTeacher: React.FC = () => {
   const [user, setUser] = useState<User | null>(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleGenerate = async () => {

    try {
      const data = await ReportService.getUserReport(
        from || undefined,
        to || undefined,
      );

      if (!data || !data.records || data.records.length === 0) {
        alert("Brak danych do wygenerowania raportu.");
        return;
      }

      generateUserPDF(data);
    } catch (error) {
      alert("Wystąpił błąd podczas pobierania raportu.");
      console.error(error);
    }
  };

  const generateUserPDF = (data: any) => {
    const doc = new jsPDF();
    doc.setFont("FreeSans", "normal");

    const title = `Raport wypożyczeń i rezerwacji - ${data.className}`;
    const subtitle = `Okres: ${
      data.fromDate ? new Date(data.fromDate).toLocaleDateString() : "początek"
    } - ${
      data.toDate ? new Date(data.toDate).toLocaleDateString() : "koniec"
    }`;

    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(subtitle, 14, 25);

    let statY = 35;

    const stats = data.statistics;

    if (stats) {
  doc.setFontSize(12);
  let currentY = statY;

  doc.text("PODSUMOWANIE OGÓLNE:", 14, currentY);
  currentY += 6;

  doc.text("Wszystkie rekordy:", 14, currentY);
  doc.text(`${stats.summary.totalRecords}`, 70, currentY);
  doc.text(`100%`, 100, currentY);
  currentY += 6;

  doc.text("Wypożyczenia:", 14, currentY);
  doc.text(`${stats.summary.totalBorrows}`, 70, currentY);
  doc.text(`${stats.summary.totalBorrowsPercent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Rezerwacje:", 14, currentY);
  doc.text(`${stats.summary.totalReservationsPercent.toFixed(1)}%`, 100, currentY);
  doc.text(`${stats.summary.totalReservations}`, 70, currentY);
  currentY += 6;

  doc.text("Aktywne:", 14, currentY);
  doc.text(`${stats.summary.totalActive}`, 70, currentY);
  doc.text(`${stats.summary.totalActivePercent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Zakończone:", 14, currentY);
  doc.text(`${stats.summary.totalCompleted}`, 70, currentY);
  doc.text(`${stats.summary.totalCompletedPercent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Anulowane:", 14, currentY);
  doc.text(`${stats.summary.totalCanceled}`, 70, currentY);
  doc.text(`${stats.summary.totalCanceledPercent.toFixed(1)}%`, 100, currentY);
  currentY += 10;

  doc.text("STATYSTYKI WYPOŻYCZEŃ:", 14, currentY);
  currentY += 6;

  doc.text("Wszystkie:", 14, currentY);
  doc.text(`${stats.summary.totalBorrows}`, 70, currentY);
  doc.text(`100%`, 100, currentY);
  currentY += 6;

  doc.text("Aktywne:", 14, currentY);
  doc.text(`${stats.borrows.active.count}`, 70, currentY);
  doc.text(`${stats.borrows.active.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Zwrócone:", 14, currentY);
  doc.text(`${stats.borrows.returned.count}`, 70, currentY);
  doc.text(`${stats.borrows.returned.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Zwrócone po terminie:", 14, currentY);
  doc.text(`${stats.borrows.returnedLate.count}`, 70, currentY);
  doc.text(`${stats.borrows.returnedLate.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Opóźnione:", 14, currentY);
  doc.text(`${stats.borrows.overdue.count}`, 70, currentY);
  doc.text(`${stats.borrows.overdue.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Anulowane:", 14, currentY);
  doc.text(`${stats.borrows.canceled.count}`, 70, currentY);
  doc.text(`${stats.borrows.canceled.percent.toFixed(1)}%`, 100, currentY);
  currentY += 10;

  doc.text("STATYSTYKI REZERWACJI:", 14, currentY);
  currentY += 6;

  doc.text("Wszystkie:", 14, currentY);
  doc.text(`100%`, 100, currentY);
  doc.text(`${stats.summary.totalReservations}`, 70, currentY);
  currentY += 6;

  doc.text("Aktywne:", 14, currentY);
  doc.text(`${stats.reservations.active.count}`, 70, currentY);
  doc.text(`${stats.reservations.active.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Zrealizowane:", 14, currentY);
  doc.text(`${stats.reservations.completed.count}`, 70, currentY);
  doc.text(`${stats.reservations.completed.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Anulowane:", 14, currentY);
  doc.text(`${stats.reservations.canceled.count}`, 70, currentY);
  doc.text(`${stats.reservations.canceled.percent.toFixed(1)}%`, 100, currentY);
  currentY += 6;

  doc.text("Wygasłe:", 14, currentY);
  doc.text(`${stats.reservations.expired.count}`, 70, currentY);
  doc.text(`${stats.reservations.expired.percent.toFixed(1)}%`, 100, currentY);
  currentY += 8;

  statY = currentY;
}

    if (data.records.length > 0) {
          autoTable(doc, {
            startY: statY,
            head: [["Typ", "Tytuł", "Użytkownik", "Od", "Do", "Data zwrotu", "Status"]],
            body: data.records.map((r: any) => [
              r.type,
              r.bookTitle,
              r.userName,
              new Date(r.fromDate).toLocaleDateString(),
              r.toDate ? new Date(r.toDate).toLocaleDateString() : "—",
              r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "—",
              r.status,
            ]),
            styles: { font: "FreeSans", fontStyle: "normal", cellPadding: 2 },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
          });
        } else {
          doc.text("Brak danych do wyświetlenia.", 14, statY + 10);
        }

    doc.save(`Raport_klasy_${data.className}_${data.fromDate || "start"}-${data.toDate || "end"}.pdf`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Raport aktywności klasy {user?.className}</h2>

      <div className={styles.addSection}>
        <label>Od:</label>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={styles.input} />
      </div>

      <div className={styles.addSection}>
        <label>Do:</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={styles.input} />
      </div>

        

      <div className={styles.addSection}>
        <button onClick={handleGenerate} className={styles.submit}>
          Generuj raport PDF
        </button>
      </div>
    </div>
  );
};

export default ReportPageTeacher;
