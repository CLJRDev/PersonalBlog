using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalBlogBE.Models
{
    public class Post
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required, Column(TypeName="nvarchar(100)")]
        public string Title { get; set; }

        [Required, Column(TypeName="nvarchar(200)")]
        public string Slug { get; set; }

        [Required]
        public string Content { get; set; }

        [Column(TypeName="nvarchar(255)")]
        public string ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // ? = nullable
        public DateTime? UpdatedAt { get; set; }

        public bool IsPublished { get; set; } = false;

        // Foreign keys        
        public string CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public User Author { get; set; }
    }
}
