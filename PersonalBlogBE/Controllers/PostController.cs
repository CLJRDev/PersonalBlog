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
using PersonalBlogBE.Shared;

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

            var posts = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Author)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Slug,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedAt,
                    p.UpdatedAt,
                    p.IsPublished,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name
                    },
                    Author = new
                    {
                        p.Author.Id,
                        p.Author.IsAdmin,
                        p.Author.FullName,
                        p.Author.ImageUrl
                    }
                }).OrderByDescending(p => p.CreatedAt).ToListAsync();

            return Ok(posts);
        }

        // GET: api/Post/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(string id)
        {
            if (_context.Posts == null)
            {
                return NotFound(new {message = "No posts found!"});
            }

            var post = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Author)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Slug,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedAt,
                    p.UpdatedAt,
                    p.IsPublished,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name
                    },
                    Author = new
                    {
                        p.Author.Id,
                        p.Author.IsAdmin,
                        p.Author.FullName,
                        p.Author.ImageUrl
                    }
                }).FirstOrDefaultAsync();


            if (post == null)
            {
                return NotFound(new { message = "Post not found!" });
            }

            return Ok(post);
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
            post.Slug = SlugHelper.GenerateSlug(form.Title);
            post.Content = form.Content;
            post.UpdatedAt = DateTime.Now;
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
            else
            {
                //Nếu không có ảnh mới mà có ảnh cũ, thì xóa ảnh cũ (Tức là người dùng đã remove ảnh khi sửa bài đăng)
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                    post.ImageUrl = null; //Xóa đường dẫn ảnh
                }
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
                Slug = SlugHelper.GenerateSlug(form.Title),
                Content = form.Content,
                ImageUrl = null,
                CreatedAt = DateTime.Now,
                IsPublished = true,
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

        // UNPUBLISH: api/Post/publish
        [HttpPut("publish/{id}")]
        public async Task<IActionResult> Publish(string id, [FromForm] bool isPublished)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Post not found!" });
            }

            post.IsPublished = isPublished;
            post.UpdatedAt = DateTime.Now;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            string message = isPublished ? "Post has been published!" : "Post has been unpublished!";

            return Ok(new {message});
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
