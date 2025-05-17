using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalBlogBE.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

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
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int AuthorId { get; set; }
        public User Author { get; set; }


    }
}
