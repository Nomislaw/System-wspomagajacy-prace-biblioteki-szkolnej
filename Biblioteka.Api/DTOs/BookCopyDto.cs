namespace Biblioteka.Api.DTOs;

public class BookCopyDto
{
    public int Id { get; set; }
    public string BarCode { get; set; }
    public bool IsAvailable { get; set; }
    public int BookId { get; set; }
    public string BookTitle { get; set; }
}