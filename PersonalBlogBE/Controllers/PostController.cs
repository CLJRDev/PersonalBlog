using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalBlogBE.Dto;
using PersonalBlogBE.Models;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PostController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public PostController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/Post
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            if (_context.Posts == null)
            {
                return NotFound(new { message = "No posts found!" });
            }
            return await _context.Posts.ToListAsync();
        }

        // GET: api/Post/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(string id)
        {
            if (_context.Posts == null)
            {
                return NotFound(new {message = "No posts found!"});
            }

            var post = await _context.Posts.FindAsync(id);                  
            if (post == null)
            {
                return NotFound(new { message = "Post not found!" });
            }

            return post;
        }

        // PUT: api/Post/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(string id,[FromForm] PostDto form)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Post not found!" });
            }

            //1. Lấy thông tin từ form
            post.Title = form.Title;
            post.Slug = form.Slug;
            post.Content = form.Content;
            post.UpdatedAt = DateTime.Now;
            post.IsPublished = form.IsPublished;
            post.CategoryId = form.CategoryId;

            //2. Xử lý ảnh
            if (form.Image != null && form.Image.Length > 0)
            {
                //2.1. Delete old image if exists
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                //2.2. Save new image
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/posts");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(form.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await form.Image.CopyToAsync(stream);
                }
                post.ImageUrl = $"/images/posts/{fileName}";
            }

            //3. Lưu vào database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;                
            }

            return Ok(new { message = "Post updated successfully!" });
        }

        // POST: api/Post
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostPost([FromForm] PostDto form)
        {
            //1. Lấy thông tin từ form
            var post = new Post
            {
                Title = form.Title,
                Slug = form.Slug,
                Content = form.Content,
                ImageUrl = null,
                CreatedAt = DateTime.Now,
                IsPublished = form.IsPublished,
                CategoryId = form.CategoryId,
                AuthorId = form.AuthorId
            };

            //2. Xử lý ảnh
            if(form.Image != null && form.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/posts");
                if(!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(form.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await form.Image.CopyToAsync(stream);
                }

                post.ImageUrl = $"/images/posts/{fileName}";
            }            

            _context.Posts.Add(post);

            //3. Lưu vào database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { message = "Post created successfully!" });
        }

        // DELETE: api/Post/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(string id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new {message = "Post not found!"});
            }

            _context.Posts.Remove(post);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            //Xóa ảnh nếu có
            if (post.ImageUrl != null)
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }            

            return Ok(new { message = "Post deleted successfully!" });
        }

        private bool PostExists(string id)
        {
            return (_context.Posts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
