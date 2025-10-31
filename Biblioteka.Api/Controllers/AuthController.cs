using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Biblioteka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly IEmailService _emailService;

    public AuthController(AppDbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
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

        if (!user.EmailConfirmed)
        {
            return BadRequest(new { errors = "E-mail nie został zweryfikowany" });
        }
        
        var token = GenerateJwtToken(user);

        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role.ToString(),
            FirstName = user.FirstName,
            LastName = user.LastName,
            Token = token
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
        user.VerificationToken = Guid.NewGuid().ToString();
        user.EmailConfirmed = false;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        var verifyUrl = $"http://localhost:3000/verify?token={user.VerificationToken}";
        var body = $"<h3>Witaj {user.Email}!</h3><p>Kliknij link, aby zweryfikować swoje konto:</p><a href='{verifyUrl}'>Zweryfikuj konto</a>";
        await _emailService.SendEmailAsync(user.Email, "Weryfikacja konta", body);

        return Ok(new { user.Id, user.Email, Role = user.Role.ToString() });
    }
    
    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token))
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Brak tokenu" } });
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);


        if (user == null)
        {
            var alreadyConfirmed = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmed && u.VerificationToken == null);
                if (alreadyConfirmed != null)
                    return BadRequest(new ErrorResponse { Errors = new List<string> { "Ten link został już użyty" } });
                
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Niepoprawny token" } });
        }

        user.EmailConfirmed = true;
        user.VerificationToken = null;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Twój adres e-mail został zweryfikowany. Możesz się teraz zalogować." });
    }


    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()) 
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

