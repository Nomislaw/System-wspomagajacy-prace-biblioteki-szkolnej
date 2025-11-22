import React, { useEffect, useState } from "react";
import { Borrow, BorrowStatus } from "../../types/Index";
import { BorrowService } from "../../api/BorrowService";
import styles from "./User.module.css";

interface MyBorrowsProps {
  statusFilter: BorrowStatus[];
}

const MyBorrowsList: React.FC<MyBorrowsProps> = ({ statusFilter }) => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  const fetchBorrows = async () => {
    try {
      const res = await BorrowService.getAllUserBorrows();
      setBorrows(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania wypożyczeń");
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const getStatusColor = (status: any): string => {
    switch (status) {
      case BorrowStatus.Active:
        return "green";
      case BorrowStatus.Returned:
        return "blue";
      case BorrowStatus.ReturnedLate:
        return "darkblue";
      case BorrowStatus.Canceled:
        return "red";
      case BorrowStatus.Overdue:
        return "orange";
      default:
        return "black";
    }
  };

  const getStatusName = (status: any): string => {
    switch (status) {
      case BorrowStatus.Active:
        return "Aktywny";
      case BorrowStatus.Returned:
        return "Zwrócony";
      case BorrowStatus.ReturnedLate:
        return "Zwrócony po terminie";
      case BorrowStatus.Canceled:
        return "Anulowany";
      case BorrowStatus.Overdue:
        return "Opóźniony";
      default:
        return "Nieznany";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredBorrows = borrows.filter((b) =>
    statusFilter.includes(b.borrowStatus)
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Moje wypożyczenia</h2>

      {filteredBorrows.length === 0 ? (
        <p className={styles.noResults}>Brak wypożyczeń o wybranym statusie.</p>
      ) : (
        <div className={styles.booksGrid}>
          {filteredBorrows.map((b) => (
            <div key={b.id} className={styles.bookCard}>
              <div className={styles.bookHeader}>
                <h3 className={styles.bookTitle}>{b.bookTitle}</h3>
              </div>

              <p className={styles.p}>
                <strong>Data wypożyczenia:</strong> {formatDate(b.borrowDate)}
              </p>
              <p className={styles.p}>
                <strong>Godzina wypożyczenia:</strong> {formatTime(b.borrowDate)}
              </p>
              <br />

            {(b.borrowStatus !== BorrowStatus.Returned && b.borrowStatus !== BorrowStatus.ReturnedLate) && (
                <>
                    <p className={styles.p}>
                    <strong>Termin oddania:</strong> {formatDate(b.terminDate)}
                    </p>
                    <p className={styles.p}>
                    <strong>Godzina oddania:</strong> {formatTime(b.terminDate)}
                    </p>
                    <br />
                </>
                )}


              {b.returnDate && (
                <>
                  <p className={styles.p}>
                    <strong>Data zwrotu:</strong> {formatDate(b.returnDate)}
                  </p>
                  <p className={styles.p}>
                    <strong>Godzina zwrotu:</strong> {formatTime(b.returnDate)}
                  </p>
                  <br />
                </>
              )}

              <p className={styles.p}>
                <strong>Status:</strong>{" "}
                <span style={{ color: getStatusColor(b.borrowStatus) }}>
                  {getStatusName(b.borrowStatus)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowsList;
