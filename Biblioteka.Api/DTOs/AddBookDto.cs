namespace Biblioteka.Api.DTOs;

public class AddBookDto
{
    public string Title { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int AuthorId { get; set; }
    public int PublisherId { get; set; }
    public int CategoryId { get; set; }
}
