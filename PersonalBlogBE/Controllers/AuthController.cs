using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PersonalBlogBE.Dtos;
using PersonalBlogBE.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using PersonalBlogBE.Interfaces;
using Microsoft.Win32;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;


        public AuthController(BlogDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginDto login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            if (!user.IsConfirmEmail)
            {
                return BadRequest(new { message = "Please confirm your email before logging in." });
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

            return Ok(new {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new {                    
                    user.Username,
                    user.Email,
                    user.IsAdmin
                },
                message = "Welcome " + user.FullName + "."
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDto register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data!" });
            }

            if (register.Password != register.ConfirmPassword)
            {
                return BadRequest(new { message = "Password and Confirm Password do not match!" });
            }

            bool usernameExists = await _context.Users.AnyAsync(u => u.Username == register.Username);
            if (usernameExists)
            {
                return BadRequest(new { message = "Username already exists!" });
            }

            bool emailExists = await _context.Users.AnyAsync(u => u.Email == register.Email);
            if (emailExists)
            {
                return BadRequest(new { message = "Email already exists!" });
            }

            //Tạo token xác nhận email
            var confirmToken = Guid.NewGuid().ToString();

            var user = new User
            {
                Username = register.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                Email = register.Email,
                FullName = register.FullName,
                IsAdmin = false,
                IsConfirmEmail = false,
                EmailConfirmToken = confirmToken,
                CreatedAt = DateTime.Now,
            };

            // Handle image upload if provided
            if (register.Image != null && register.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/users");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(register.Image.FileName);
                using (var stream = new FileStream(Path.Combine(uploadsFolder, fileName), FileMode.Create))
                {
                    await register.Image.CopyToAsync(stream);
                }

                user.ImageUrl = $"/images/users/{fileName}";
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        
            var confirmUrl = $"http://localhost:5019/api/auth/confirm-email?token={confirmToken}";
            var emailBody = $"<h3>Confirm your email</h3><p>Click the link below to confirm your account:</p><a href='{confirmUrl}'>Confirm Email</a>";
            
            await _emailService.SendEmailAsync(user.Email, "Confirm your registration", emailBody);

            return Ok(new { message = "Account registered successfully! Please check your email to confirm." });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmToken == token);
            if (user == null) return BadRequest(new { message = "Invalid token!" });

            user.IsConfirmEmail = true;
            user.EmailConfirmToken = "";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Email confirmed successfully!" });
        }
    }
}
