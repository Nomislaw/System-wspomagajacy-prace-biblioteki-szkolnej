namespace Biblioteka.Api.Models;

public class Borrow
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public virtual Book Book { get; set; } = null!;

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public BorrowStatus BorrowStatus { get; set; }

    public DateTime BorrowDate { get; set; }
    public DateTime? TerminDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public int? ReservationId { get; set; }
    public virtual Reservation? Reservation { get; set; }
}