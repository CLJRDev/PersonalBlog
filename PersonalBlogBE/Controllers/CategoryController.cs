using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalBlogBE.Models;

namespace PersonalBlogBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public CategoryController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
          if (_context.Categories == null)
          {
               return NotFound(new { message = "Category list is empty!" });
          }

          return await _context.Categories.ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(string id)
        {
          if (_context.Categories == null)
          {
                return NotFound(new { message = "Category list is empty!" });
          }

          var category = await _context.Categories.FindAsync(id);

          if (category == null)
          {
              return NotFound(new { message = "Category not found!" });
          }

          return category;
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")] // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> PutCategory(string id, Category obj)
        {
            var category   = await _context.Categories.FindAsync(id);
            if(category == null)
            {
                return NotFound(new {message = "Category not found!"});
            }

            category.Name = obj.Name;
            category.Slug = obj.Slug;
            category.Description = obj.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { message = "Category updated successfully!" });
        }

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Policy = "AdminOnly")] // Chỉ cho phép Admin truy cập
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category created successfully!" });
        }

        // Thêm một list các category
        [HttpPost("bulk")]
        [Authorize(Policy = "AdminOnly")] // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> BulkInsertCategories([FromBody] List<Category> categories)
        {
            if (categories == null || categories.Count == 0)
            {
                return BadRequest("No categories to add!");
            }

            _context.Categories.AddRange(categories);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{categories.Count} categories added successfully." });
        }


        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")] // Chỉ cho phép Admin truy cập
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "Category not found!" });
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully!" });
        }

        private bool CategoryExists(string id)
        {
            return (_context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
