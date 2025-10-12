namespace Biblioteka.Api.Models;

public class Report
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Content { get; set; } = string.Empty;
}