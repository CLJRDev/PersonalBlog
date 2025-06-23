using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalBlogBE.Dtos;
using PersonalBlogBE.Models;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]    
    [ApiController]
    [Authorize] // Chỉ cho phép người dùng đã đăng nhập truy cập
    [Authorize(Policy = "AdminOnly")] // Chỉ cho phép Admin truy cập
    public class UserController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public UserController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound(new {message = "User list is empty!"});
            }

            return await _context.Users.OrderBy(x => x.CreatedAt).ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            if (_context.Users == null)
            {
                return NotFound(new { message = "User list is empty!" });
            }
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found!"});
            }

            return user;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, [FromForm] UserDto payload)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data!" });
            }

            if (payload.Password != payload.ConfirmPassword &&  !String.IsNullOrEmpty(payload.Password) && !String.IsNullOrEmpty(payload.ConfirmPassword))
            {
                return BadRequest(new { message = "Password and Confirm Password do not match!" });
            }

            var existingUser = await _context.Users
                .Where(u => u.Id != id)
                .FirstOrDefaultAsync(u => u.Username == payload.Username || u.Email == payload.Email);

            if (existingUser != null)
            {
                if (existingUser.Username == payload.Username)                
                    return BadRequest(new { message = "Username already exists!" });                
                if (existingUser.Email == payload.Email)                
                    return BadRequest(new { message = "Email already exists!" });                
            }

            user.Username = payload.Username;
            user.Email = payload.Email;
            user.FullName = payload.FullName;
            user.IsAdmin = payload.IsAdmin;
            if(!String.IsNullOrEmpty(payload.Password) && !String.IsNullOrEmpty(payload.ConfirmPassword))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(payload.Password);

            // Handle image upload if provided
            if(payload.Image != null && payload.Image.Length > 0)
            {
                //1. Delete old image if exists
                if (!string.IsNullOrEmpty(user.ImageUrl))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                //2. Save new image
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/users");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(payload.Image.FileName);
                using (var stream = new FileStream(Path.Combine(uploadsFolder, fileName), FileMode.Create))
                {
                    await payload.Image.CopyToAsync(stream);
                }

                user.ImageUrl = $"/images/users/{fileName}";
            }            

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {               
                throw;                
            }

            return Ok(new { message = "User updated successfully!" });
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromForm] UserDto payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data!" });
            }

            if (payload.Password != payload.ConfirmPassword)
            {
                return BadRequest(new { message = "Password and Confirm Password do not match!" });
            }

            bool usernameExists = await _context.Users.AnyAsync(u => u.Username == payload.Username);
            if (usernameExists)
            {
                return BadRequest(new { message = "Username already exists!" });
            }

            bool emailExists = await _context.Users.AnyAsync(u => u.Email == payload.Email);
            if (emailExists)
            {
                return BadRequest(new { message = "Email already exists!" });
            }
                       
            var user = new User
            {                
                Username = payload.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(payload.Password),
                Email = payload.Email,
                FullName = payload.FullName,
                IsAdmin = payload.IsAdmin,
                IsConfirmEmail = true,
                CreatedAt = DateTime.Now,
            };

            // Handle image upload if provided
            if(payload.Image != null && payload.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/users");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(payload.Image.FileName);
                using (var stream = new FileStream(Path.Combine(uploadsFolder, fileName), FileMode.Create))
                {
                    await payload.Image.CopyToAsync(stream);
                }

                user.ImageUrl = $"/images/users/{fileName}";
            }

            _context.Users.Add(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { message = "User created successfully!" });
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new {message = "User not found!"});
            }

            _context.Users.Remove(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            // Xóa ảnh nếu có
            if (!string.IsNullOrEmpty(user.ImageUrl))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }          

            return Ok(new { message = "User deleted successfully!" });
        }

        // POST: Thêm danh sách user
        [HttpPost("bulk")]
        public async Task<IActionResult> BulkInsertUsers([FromBody]List<User> users)
        {
            if (users == null || users.Count == 0)
            {
                return BadRequest(new { message = "No users to add!" });
            }
            _context.Users.AddRange(users);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Users created successfully!" });
        }

        private bool UserExists(string id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
