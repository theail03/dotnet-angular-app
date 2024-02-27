using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedRoles(RoleManager<AppRole> roleManager)
        {
            if (await roleManager.Roles.AnyAsync()) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
        }

        public static async Task SeedDatasets(DataContext context)
        {
            if (await context.Datasets.AnyAsync()) return;

            string jsonData = await File.ReadAllTextAsync("Data/DatasetSeedData.json");
            var datasetList = JsonSerializer.Deserialize<List<Dataset>>(jsonData);

            // Add range of datasets to context
            await context.Datasets.AddRangeAsync(datasetList);

            await context.SaveChangesAsync();
        }
    }
}