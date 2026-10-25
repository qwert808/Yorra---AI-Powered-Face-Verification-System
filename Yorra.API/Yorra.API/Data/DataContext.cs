using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Yorra.API.Models; 

namespace Yorra.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        // This property will become the "Users" table in our database
        public DbSet<User> Users { get; set; }
    }
}
