using Microsoft.EntityFrameworkCore;
using Yorra.API.Data;

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container. ---

// 1. Add the Database Context service
builder.Services.AddDbContext<DataContext>(options =>
{
    // Configure the context to use PostgreSQL.
    // Replace the connection string with your actual PostgreSQL connection string.
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
