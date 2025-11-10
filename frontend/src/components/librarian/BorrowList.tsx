import React, { useEffect, useState } from "react";
import { Borrow, BorrowStatus } from "../../types/Index";
import { BorrowService } from "../../api/BorrowService";
import styles from "./Librarian.module.css";

const BorrowList: React.FC = () => {
  
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchUser, setSearchUser] = useState("");
  const [filterStatus, setFilterStatus] = useState<BorrowStatus | "All">("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      //await BorrowService.updateOverdueBorrows();

      const data = await BorrowService.getAllBorrows();
      setBorrows(data);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas pobierania wypożyczeń.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusOrder = (status: BorrowStatus): number => {
  switch (status) {
    case BorrowStatus.Active:
      return 1;
    case BorrowStatus.Overdue:
      return 2;
    case BorrowStatus.Returned:
      return 5;
    case BorrowStatus.ReturnedLate:
      return 6;
    case BorrowStatus.Canceled:
      return 7;
    case BorrowStatus.Lost:
      return 3;
    case BorrowStatus.Damaged:
      return 4;
    default:
      return 99;
  }
};

  const filteredAndSortedBorrows = borrows
  .filter(b => 
    b.userName.toLowerCase().includes(searchUser.toLowerCase()) &&
    (filterStatus === "All" || b.borrowStatus === filterStatus)
  )
  .sort((a, b) => {
    const statusDiff = getStatusOrder(a.borrowStatus) - getStatusOrder(b.borrowStatus);
    if (statusDiff !== 0) return statusDiff;

    return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
  });


  const handleUpdateStatus = async (id: number, newStatus: BorrowStatus) => {
    if (!window.confirm("Na pewno chcesz zmienić status tego wypożyczenia?")) return;

    try {
      if (newStatus === BorrowStatus.Returned) {
      await BorrowService.setBorrowReturnDate(id);
    } else {
      await BorrowService.updateBorrowStatus(id, newStatus);
    }
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zmiany statusu.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



const getStatusName = (status: any): string => {
  switch (status) {
    case BorrowStatus.Active:
      return "Aktywne";
    case BorrowStatus.Returned:
      return "Zwrócone";
    case BorrowStatus.ReturnedLate:
      return "Zwrócone po terminie";
    case BorrowStatus.Canceled:
      return "Anulowane";
    case BorrowStatus.Overdue:
      return "Opóźnione";
    case BorrowStatus.Lost:
      return "Zagubione";
    case BorrowStatus.Damaged:
      return "Uszkodzone";
    default:
      return "Nieznany";
  }
};

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
    case BorrowStatus.Lost:
      return "purple";
    case BorrowStatus.Damaged:
      return "brown";
    default:
      return "black";
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.authorsListSection}>
        <h2 className={styles.title}>Lista wypożyczeń</h2>

        <div className={styles.filters}>
          <input
            className={styles.input}
            type="text"
            placeholder="Szukaj po nazwisku użytkownika"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <select
            className={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BorrowStatus | "All")}
          >
            <option value="All">Wszystkie statusy</option>
            {Object.values(BorrowStatus).map(status => (
              <option key={status} value={status}>
                {getStatusName(status)}
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
                <th>Data wypożyczenia</th>
                <th>Termin zwrotu</th>
                <th>Data zwrotu</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBorrows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    Brak wypożyczeń pasujących do kryteriów.
                  </td>
                </tr>
              ) : (
                filteredAndSortedBorrows.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.bookTitle}</td>
                    <td>{b.userName}</td>
                    <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td>{b.terminDate ? new Date(b.terminDate).toLocaleDateString() : "—"}</td>
                    <td>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "—"}</td>
                    <td style={{ color: getStatusColor(b.borrowStatus) }}>
                      {getStatusName(b.borrowStatus)}
                    </td>
                    <td>
                      {(b.borrowStatus === BorrowStatus.Active ||
                        b.borrowStatus === BorrowStatus.Overdue ||
                        b.borrowStatus === BorrowStatus.Lost ||
                        b.borrowStatus === BorrowStatus.Damaged) && (
                        <select
                          className={styles.select}
                          onChange={(e) =>
                            handleUpdateStatus(b.id, e.target.value as BorrowStatus)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Zmień status
                          </option>
                          <option value="Active">Aktywny</option>
                          <option value="Returned">Zwrócony</option>
                          <option value="Canceled">Anulowany</option>
                          <option value="Lost">Zagubiony</option>
                          <option value="Damaged">Uszkodzony</option>
                        </select>
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

export default BorrowList;
