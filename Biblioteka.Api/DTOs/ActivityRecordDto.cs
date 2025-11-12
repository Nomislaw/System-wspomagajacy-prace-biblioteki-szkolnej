namespace Biblioteka.Api.DTOs;

public class ActivityRecordDto 
{
    public int Id { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; } 
    public DateTime? ToDate { get; set; } 
    public DateTime? ReturnDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}