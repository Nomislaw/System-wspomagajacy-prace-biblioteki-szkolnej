import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportService } from "../../api/ReportService";
import { UserService } from "../../api/UserService";
import { User } from "../../types/Index";
import "../../fonts/FreeSans-normal";
import styles from "./Librarian.module.css";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

const ReportPage: React.FC = () => {
  const [reportType, setReportType] = useState<"users" | "books">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | number>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportType === "users") {
      UserService.getAllUsers().then(setUsers);
    } else if (reportType === "books") {
      setLoading(true);
      ReportService.getBooksReport()
        .then(setBooks)
        .finally(() => setLoading(false));
    }
  }, [reportType]);

  const handleGenerate = async () => {
    if (reportType === "users") {
      try {
        const data = await ReportService.getUserReport(
          from || undefined,
          to || undefined,
          userId === "all" ? undefined : userId
        );

        if (!data || !data.records || data.records.length === 0) {
          alert("Brak danych do wygenerowania raportu.");
          return;
        }

        setReportData(data);
        generateUserPDF(data);
      } catch (error) {
        alert("Wystąpił błąd podczas pobierania raportu.");
        console.error(error);
      }
    } else if (reportType === "books") {
      generateBooksPDF();
    }
  };

  const generateUserPDF = (data: any) => {
    const doc = new jsPDF();
    doc.setFont("FreeSans", "normal");

    const title = `Raport wypożyczeń i rezerwacji - ${data.userName ?? "Wszyscy użytkownicy"}`;
    const subtitle = `Okres: ${data.fromDate ? new Date(data.fromDate).toLocaleDateString() : "początek"} - ${
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

    doc.save(`Raport_${data.userName || "wszyscy"}_${data.fromDate || "start"}-${data.toDate || "end"}.pdf`);
  };

  const generateBooksPDF = () => {
    if (!books || books.length === 0) {
      alert("Brak danych do wygenerowania raportu.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("FreeSans", "normal");
    const title = "Raport stanu książek w bibliotece";
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 25,
      head: [["Tytuł", "ISBN", "Rok wydania", "Ilość", "Dostępne", "Autor", "Kategoria", "Wydawca"]],
      body: books.map((b) => [
        b.title,
        b.isbn,
        b.publicationYear,
        b.quantity,
        b.available,
        b.authorName,
        b.categoryName,
        b.publisherName,
      ]),
      styles: { font: "FreeSans", fontStyle: "normal", cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    });

    doc.save(`Raport_ksiazek_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generowanie raportów</h2>

      <div className={styles.addSection}>
        <label>Wybierz:</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value as "users" | "books")} className={styles.select}>
          <option value="users">Raport aktywności użytkowników</option>
          <option value="books">Raport stanu książek</option>
        </select>
      </div>

      {reportType === "users" && (
        <div className={styles.addSection}>
          <div>
            <label>Od:</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={styles.input} />
          </div>

          <div>
            <label>Do:</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={styles.input} />
          </div>

          <div>
            <label>Użytkownik:</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)} className={styles.select}>
              <option value="all">Wszyscy</option>
              {users.map((u: User) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={styles.addSection}>
        <button onClick={handleGenerate} className={styles.submit}>
          Generuj raport PDF
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
