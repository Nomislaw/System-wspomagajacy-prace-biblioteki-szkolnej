namespace Biblioteka.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Role Role { get; set; }

    public virtual ICollection<Borrow>? Borrows { get; set; }
    public virtual ICollection<Reservation>? Reservations { get; set; }
    public virtual ICollection<Review>? Reviews { get; set; }
}