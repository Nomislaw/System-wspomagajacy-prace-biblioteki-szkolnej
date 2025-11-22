using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.Models;

public class Book
{
    public int Id { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    [Required]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ISBN musi mieć dokładnie 13 znaków.")]
    public string ISBN { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public virtual Author Author { get; set; } = null!;

    public int PublisherId { get; set; }
    public virtual Publisher Publisher { get; set; } = null!;

    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
    
    public ICollection<Reservation>? Reservations { get; set; }
    
    public ICollection<BookCopy>? BookCopies { get; set; }
    public int GetAvailableQuantity()
    {
        int totalAvailableCopies = BookCopies?.Count(c => c.IsAvailable) ?? 0;
        int activeReservations = Reservations?.Count(r => r.ReservationStatus == ReservationStatus.Active) ?? 0;
        int availableAfterReservations = totalAvailableCopies - activeReservations;

        return availableAfterReservations > 0 ? availableAfterReservations : 0;
    }
    public int GetQuantity()
    {
        return BookCopies?.Count() ?? 0;
    }

}