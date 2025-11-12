using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    [Required]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ISBN musi mieć dokładnie 13 znaków.")]
    public string ISBN { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    public int Quantity { get; set; }
    public int Available { get; set; }
    public int AuthorId { get; set; }
    public int CategoryId { get; set; }
    public int PublisherId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string PublisherName { get; set; } = string.Empty;
}
