using System.ComponentModel.DataAnnotations;
using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return Unauthorized(new ErrorResponse { Errors = new List<string> { "Niepoprawny adres e-mail" } });

        var result = _passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new ErrorResponse { Errors = new List<string> { "Niepoprawne hasło" } });

        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role.ToString(),
            FirstName = user.FirstName,
            LastName = user.LastName
        });
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (await _context.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Adres e-mail jest już zarejestrowany" } });

        var user = new User
        {
            Email = req.Email,
            FirstName = req.FirstName,
            LastName = req.LastName,
            Role = Role.User
        };

        user.Password = _passwordHasher.HashPassword(user, req.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { user.Id, user.Email, Role = user.Role.ToString() });
    }
}




