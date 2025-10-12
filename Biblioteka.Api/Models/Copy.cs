namespace Biblioteka.Api.Models;

public class Copy
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public virtual Book Book { get; set; } = null!;
    public bool IsAvailable { get; set; }
}