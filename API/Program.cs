using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var connectionString = "";
if (builder.Environment.IsDevelopment())
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
else
{
    // Use connection string provided at runtime by Fly.IO.
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    Uri uri = new Uri(databaseUrl);
    string host = uri.Host;
    string port = uri.Port.ToString();
    string database = uri.AbsolutePath.Trim('/');
    string userId = uri.UserInfo.Split(':')[0];
    string password = uri.UserInfo.Split(':')[1];
    string sslMode = "Disable"; // Default to Disable unless specified in the query params

    // Extract any parameters from the query string (e.g., sslmode)
    var query = QueryHelpers.ParseQuery(uri.Query);

    StringValues sslModeValue;
    if (query.TryGetValue("sslmode", out sslModeValue))
    {
        sslMode = sslModeValue.ToString();
    }

    connectionString = $"Server={host};Port={port};User Id={userId};Password={password};Database={database};SslMode={sslMode};";
}
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseNpgsql(connectionString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var runMigrations = builder.Configuration.GetValue<bool>("RunMigrations");
    if (runMigrations) {
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        var context = services.GetRequiredService<DataContext>();
        await context.Database.MigrateAsync();
        await Seed.SeedRoles(roleManager);
        await Seed.SeedDatasets(context);
    }
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
