using System.Text.Json.Serialization;

namespace Biblioteka.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Role Role { get; set; }
    
    public bool EmailConfirmed { get; set; } = false;
    public string? VerificationToken { get; set; } 
    public string? PasswordResetToken { get; set; } 
    public DateTime? PasswordResetTokenExpiry { get; set; }

    public virtual ICollection<Borrow>? Borrows { get; set; }
    public virtual ICollection<Reservation>? Reservations { get; set; }
    public virtual ICollection<Review>? Reviews { get; set; }
}