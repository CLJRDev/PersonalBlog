using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalBlogBE.Models;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<ActionResult<Post>> GetPost(int id)
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
        public async Task<IActionResult> PutPost(int id, Post obj)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Post not found!" });
            }

            post.Title = obj.Title;
            post.Slug = obj.Slug;
            post.Content = obj.Content;
            post.ImageUrl = obj.ImageUrl;
            post.UpdatedAt = DateTime.Now;
            post.IsPublished = obj.IsPublished;
            post.CategoryId = obj.CategoryId;

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
        public async Task<ActionResult<Post>> PostPost(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post created successfully!" });
        }

        // DELETE: api/Post/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new {message = "Post not found!"});
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post deleted successfully!" });
        }

        // POST: Thêm danh sách bài đăng
        [HttpPost("bulk")]
        public async Task<IActionResult> BulkInserPosts([FromBody] List<Post> posts)
        {
            if (posts == null || posts.Count == 0)
            {
                return BadRequest(new { message = "No posts to add!" });
            }
            _context.Posts.AddRange(posts);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Posts added successfully!" });
        }

        private bool PostExists(int id)
        {
            return (_context.Posts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
