using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class AddBookDto
{
    public string Title { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    [Required]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ISBN musi mieć dokładnie 13 znaków.")]
    public string ISBN { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int AuthorId { get; set; }
    public int PublisherId { get; set; }
    public int CategoryId { get; set; }
}
