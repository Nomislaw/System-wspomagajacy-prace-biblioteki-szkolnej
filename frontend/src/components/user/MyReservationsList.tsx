import React, { useEffect, useState } from "react";
import { Reservation, ReservationStatus } from "../../types/Index";
import { ReservationService } from "../../api/ReservationService";
import styles from "./User.module.css";

interface MyReservationsProps {
  statusFilter: ReservationStatus;
}

const MyReservationsList: React.FC<MyReservationsProps> = ({ statusFilter }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    try {
      const res = await ReservationService.getAllUserReservations();
      setReservations(res);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania rezerwacji");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId: number) => {
    if (!window.confirm("Na pewno chcesz anulować rezerwację?")) return;
    try {
      await ReservationService.cancelReservation(reservationId);
      fetchReservations();
    } catch (err: any) {
      alert(err.message || "Błąd przy anulowaniu rezerwacji");
    }
  };

  const getStatusColor = (status: ReservationStatus): string => {
      switch (status) {
        case ReservationStatus.Active:
          return "green";
        case ReservationStatus.Completed:
          return "blue";
        case ReservationStatus.Canceled:
          return "red";
        case ReservationStatus.Expired:
          return "gray";
        default:
          return "black";
      }
    };

    const getStatusLabel = (status: ReservationStatus): string => {
        switch (status) {
          case ReservationStatus.Active:
            return "Aktywny";
          case ReservationStatus.Completed:
            return "Zrealizowany";
          case ReservationStatus.Canceled:
            return "Anulowany";
          case ReservationStatus.Expired:
            return "Wygasły";
          default:
            return "Nieznany";
        }
      };

    const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const filteredReservations = reservations.filter(
    (r) => r.reservationStatus === statusFilter
  );

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Moje rezerwacje</h2>

      {filteredReservations.length === 0 ? (
        <p className={styles.noResults}>Brak rezerwacji o wybranym statusie.</p>
      ) : (
        <div className={styles.booksGrid}>
          {filteredReservations.map((res) => (
            <div key={res.id} className={styles.bookCard}>
              <div className={styles.bookHeader}>
                <h3 className={styles.bookTitle}>{res.bookTitle}</h3>
              </div>
               
              <p className={styles.p}><strong>Data rezerwacji:</strong> {formatDate(res.reservationDate)}</p>
               <p className={styles.p}><strong>Godzina rezerwacji:</strong> {formatTime(res.reservationDate)}</p><br/>
              <p className={styles.p}><strong>Data wygaśnięcia:</strong> {formatDate(res.expirationDate)}</p>
              <p className={styles.p}><strong>Godzina wygaśnięcia:</strong> {formatTime(res.expirationDate)}</p><br/>
              <p className={styles.p}><strong>Status:</strong>  <span  style={{ color: getStatusColor(res.reservationStatus) }}>{getStatusLabel(res.reservationStatus)}</span></p>

              {res.reservationStatus === "Active" && (
                <button
                  className={`${styles.reserveButton} ${styles.cancelButton}`}
                  onClick={() => handleCancel(res.id)}
                >
                  Anuluj rezerwację
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsList;
