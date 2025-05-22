using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalBlogBE.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName="nvarchar(100)")]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required, Column(TypeName ="nvarchar(255)"), EmailAddress]
        public string Email { get; set; }

        [Required, Column(TypeName="nvarchar(255)")]
        public string FullName { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public bool IsAdmin { get; set; }
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
