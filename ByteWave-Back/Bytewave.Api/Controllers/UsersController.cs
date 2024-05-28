using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Bytewave.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace Bytewave.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(UserManager<User> userManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.PasswordHash,
                    Role = roles
                });
            }

            return Ok(userList);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var role = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                Role = role.FirstOrDefault()
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserModel model)
        {
            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            if (!string.IsNullOrEmpty(model.Role))
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.UserName = model.UserName;
            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var currentRole = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRole);
            if (!string.IsNullOrEmpty(model.Role))
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }
    }

    public class UserModel
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Role { get; set; }
    }
    public class ChangePasswordModel
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
