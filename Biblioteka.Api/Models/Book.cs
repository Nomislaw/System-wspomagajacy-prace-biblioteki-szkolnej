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
    public int Quantity { get; set; }

    public int AuthorId { get; set; }
    public virtual Author Author { get; set; } = null!;

    public int PublisherId { get; set; }
    public virtual Publisher Publisher { get; set; } = null!;

    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
    
}