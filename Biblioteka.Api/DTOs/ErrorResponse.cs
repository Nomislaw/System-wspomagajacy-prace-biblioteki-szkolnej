namespace Biblioteka.Api.DTOs;

public class ErrorResponse
{
    public bool Success { get; set; } = false;
    public List<string> Errors { get; set; } = new();
}