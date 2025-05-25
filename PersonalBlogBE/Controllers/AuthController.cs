using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PersonalBlogBE.Dtos;
using PersonalBlogBE.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(BlogDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginDto login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == login.Username && u.PasswordHash == login.Password);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // Generate JWT token
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("isAdmin", user.IsAdmin.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new {token = new JwtSecurityTokenHandler().WriteToken(token)});
        }
    }
}
