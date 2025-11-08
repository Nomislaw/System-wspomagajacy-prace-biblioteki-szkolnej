using Biblioteka.Api.Models;

namespace Biblioteka.Api.DTOs;

public class ReservationDto
{
    public int Id { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime ReservationDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public ReservationStatus ReservationStatus { get; set; }
}
