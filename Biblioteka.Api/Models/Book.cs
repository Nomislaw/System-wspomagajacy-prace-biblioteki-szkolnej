namespace Biblioteka.Api.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    public string ISBN { get; set; } = string.Empty;

    public int AuthorId { get; set; }
    public virtual Author Author { get; set; } = null!;

    public int PublisherId { get; set; }
    public virtual Publisher Publisher { get; set; } = null!;

    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Copy>? Copies { get; set; }
    public virtual ICollection<Review>? Reviews { get; set; }
}