namespace Biblioteka.Api.Models;

public class Reservation
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public virtual Book Book { get; set; } = null!;

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public ReservationStatus ReservationStatus { get; set; }
    
    public DateTime ReservationDate { get; set; } = DateTime.Now;
    public DateTime ExpirationDate { get; set; } = DateTime.Now.AddDays(7);
    public virtual Borrow? Borrow { get; set; }
}