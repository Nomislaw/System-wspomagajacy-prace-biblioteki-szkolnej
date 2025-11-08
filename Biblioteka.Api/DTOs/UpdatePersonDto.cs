using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class UpdatePersonDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}