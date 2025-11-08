using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Biblioteka.Api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Biblioteka.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService) 
        {
            _userService = userService;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var entity = await _userService.GetByIdAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }
        
        [HttpPut("profile/{id}")]
        public async Task<ActionResult<User>> UpdateProfile(int id, [FromBody] UpdatePersonDto dto)
        {
            var updatedUser = await _userService.UpdateProfileAsync(id, dto);
            if (updatedUser == null) return NotFound(new ErrorResponse { Errors = new List<string> { "Użytkownik nie istnieje" } });
            return Ok(updatedUser);
        }
        
        [HttpPut("profile/{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
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
        
        [HttpPut("{id}/role")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] ChangeRoleDto dto)
        {
            var updated = await _userService.ChangeUserRoleAsync(id, dto.Role);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return Ok(new ErrorResponse { Errors = new List<string> { "Użytkownik usunięty" } });
        }
    }
}