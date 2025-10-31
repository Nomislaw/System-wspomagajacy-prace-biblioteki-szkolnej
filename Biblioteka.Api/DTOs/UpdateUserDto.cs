using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class UpdateUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}