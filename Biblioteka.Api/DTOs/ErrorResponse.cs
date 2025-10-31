namespace Biblioteka.Api.DTOs;

public class ErrorResponse
{
    public List<string> Errors { get; set; } = new();
}