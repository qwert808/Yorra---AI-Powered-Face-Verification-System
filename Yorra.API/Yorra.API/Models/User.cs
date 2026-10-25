using System.ComponentModel.DataAnnotations;

namespace Yorra.API.Models
{
    public class User
    {
        [Key] // This marks Id as the primary key
        public int Id { get; set; }

        [Required] // This makes the column not-nullable
        [StringLength(50)] // Sets a max length
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    }
}
