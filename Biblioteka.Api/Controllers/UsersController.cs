using System.Security.Claims;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context, IUserService userService,IEmailService emailService) 
        {
            _userService = userService;
            _emailService = emailService;
            _context = context;
        }
        
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> Get(int id)
        {
            var userId = GetCurrentUserId();
            if (id != userId)
                return Forbid();
            
            var entity = await _userService.GetByIdAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }
        
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> UpdateProfile(int id, [FromBody] UpdatePersonDto dto)
        {
            var userId = GetCurrentUserId();
            if (id != userId)
                return Forbid();
            var updatedUser = await _userService.UpdateProfileAsync(id, dto);
            if (updatedUser == null) return NotFound(new ErrorResponse { Errors = new List<string> { "Użytkownik nie istnieje" } });
            return Ok(updatedUser);
        }
        
        [HttpPut("{id}/active-profile")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<User>> ActiveProfile(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return null;
            if (user.EmailConfirmed) return BadRequest(new ErrorResponse { Errors = new List<string> { "Użytkownik już jest aktywny" } });
            
            user.VerificationToken = null;
            user.EmailConfirmed = true;
            
            await _context.SaveChangesAsync();
            
            return Ok(user);
        }
        
        [HttpPut("{id}/change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserId();
            if (id != userId)
                return Forbid();
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound(new ErrorResponse { Errors = new List<string> { "Użytkownik nie istnieje" } });

            var result = await _userService.ChangePasswordAsync(id, dto);
            if (!result)
                return BadRequest(new ErrorResponse { Errors = new List<string> { "Niepoprawne hasło" } });

            return Ok(new ErrorResponse { Errors = new List<string> { "Hasło zostało zmienione" } });
        }
        
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }
        
        [HttpGet("by-class/{classId}")]
        [Authorize(Roles = "Administrator,Teacher")]
        public async Task<IActionResult> GetUsersByClass(int classId)
        {
            int? id = classId == 0 ? null : classId;
                
            var users = await _context.Users
                .Where(u => u.SchoolClassId == id && (u.Role == Role.Student || u.Role == Role.Teacher))
                .Include(u => u.SchoolClass)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Role = u.Role,
                    ClassName = u.SchoolClass != null ? u.SchoolClass.ClassName : "Brak"
                })
                .ToListAsync();
            
            

            return Ok(users);
        }
        
        [HttpPut("{id}/change-class")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ChangeUserClass(int id, [FromBody] int? newClassId)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { Errors = new List<string> { "Użytkownik nie istnieje" } });
            

            user.SchoolClassId = newClassId;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Klasa użytkownika została zmieniona" });
        }
        
        [HttpPut("{id}/role")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] ChangeRoleDto dto)
        {
            var updated = await _userService.ChangeUserRoleAsync(id, dto.Role);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        
        [HttpPost("{id}/send-verify-token")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<User>> SendVerifyToken(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return null;
            if (user.EmailConfirmed) return BadRequest(new ErrorResponse { Errors = new List<string> { "Użytkownik już zweryfikował e-mail" } });
            
            user.VerificationToken = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();
        
            var verifyUrl = $"http://localhost:3000/verify?token={user.VerificationToken}";
            var body = $"<h3>Witaj {user.FirstName} {user.LastName}!</h3><p>Kliknij link, aby zweryfikować swoje konto:</p><a href='{verifyUrl}'>Zweryfikuj konto</a>";
            await _emailService.SendEmailAsync(user.Email, "Weryfikacja konta", body);
        
            return Ok(new { message = "Token weryfikacyjny został pomyślnie wysłany." });
        }
        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return Ok(new ErrorResponse { Errors = new List<string> { "Użytkownik usunięty" } });
        }
        
        private int GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new Exception("Nie udało się pobrać ID użytkownika z tokena");
    
            return int.Parse(userIdClaim.Value);
        }
    }
}