namespace Biblioteka.Api.Models;

public class Review
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public virtual Book Book { get; set; } = null!;

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public int Rating { get; set; } 
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}