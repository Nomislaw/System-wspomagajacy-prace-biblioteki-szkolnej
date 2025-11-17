import React, { useEffect, useState } from "react";
import { Reservation, ReservationStatus } from "../../types/Index";
import { ReservationService } from "../../api/ReservationService";
import styles from "./Librarian.module.css";

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchUser, setSearchUser] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "All">("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await ReservationService.getAllReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania rezerwacji");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz anulować rezerwację?")) return;
    try {
      await ReservationService.cancelReservation(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas anulowania rezerwacji");
    }
  };

  const handleConvert = async (id: number) => {
    if (!window.confirm("Czy chcesz przekształcić tę rezerwację w wypożyczenie?")) return;
    try {
      await ReservationService.convertToBorrow(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas przekształcania rezerwacji");
    }
  };

  const getStatusLabel = (status: ReservationStatus): string => {
    switch (status) {
      case ReservationStatus.Active:
        return "Aktywna";
      case ReservationStatus.Completed:
        return "Zrealizowana";
      case ReservationStatus.Canceled:
        return "Anulowana";
      case ReservationStatus.Expired:
        return "Wygasła";
      default:
        return "Nieznany";
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

  const getStatusOrder = (status: ReservationStatus): number => {
    switch (status) {
      case ReservationStatus.Active:
        return 1;
      case ReservationStatus.Completed:
        return 2;
      case ReservationStatus.Canceled:
        return 3;
      case ReservationStatus.Expired:
        return 4;
      default:
        return 99;
    }
  };

  const filteredAndSorted = reservations
    .filter((r) =>
      r.userName.toLowerCase().includes(searchUser.toLowerCase()) &&
      (filterStatus === "All" || r.reservationStatus === filterStatus)
    )
    .sort((a, b) => {
      const statusDiff = getStatusOrder(a.reservationStatus) - getStatusOrder(b.reservationStatus);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime();
    });

  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <h2 className={styles.title}>Lista rezerwacji</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Szukaj po użytkowniku..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className={styles.input}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | "All")}
            className={styles.select}
          >
            <option value="All">Wszystkie statusy</option>
            {Object.values(ReservationStatus).map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Książka</th>
                <th>Użytkownik</th>
                <th>Data rezerwacji</th>
                <th>Wygasa</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Brak rezerwacji pasujących do kryteriów.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.bookTitle}</td>
                    <td>{r.userName}</td>
                    <td>{new Date(r.reservationDate).toLocaleDateString()}</td>
                    <td>{new Date(r.expirationDate).toLocaleDateString()}</td>
                    <td style={{ color: getStatusColor(r.reservationStatus) }}>
                      {getStatusLabel(r.reservationStatus)}
                    </td>
                    <td>
                      {r.reservationStatus === ReservationStatus.Active && (
                        <>
                          <button
                            className={styles.editButton}
                            onClick={() => handleConvert(r.id)}
                          >
                            Wypożycz
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleCancel(r.id)}
                          >
                            Anuluj
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReservationList;
