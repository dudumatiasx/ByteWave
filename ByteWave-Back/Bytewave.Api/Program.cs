using Bytewave.Application.Services;
using Bytewave.Domain.Entities;
using Bytewave.Domain.Repositories;
using Bytewave.Infrastructure;
using Bytewave.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
    )
    .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling =
        Newtonsoft.Json.ReferenceLoopHandling.Ignore
    );

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bytewave API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' followed by a space and the JWT value",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        new string[] { }
    }});
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("BytewaveDb"));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var key = Encoding.ASCII.GetBytes(builder.Configuration["JWT:Secret"] ?? "");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var roles = new[] { "Admin", "Seller", "Customer" };

    foreach (var role in roles)
    {
        if (!roleManager.RoleExistsAsync(role).Result)
        {
            roleManager.CreateAsync(new IdentityRole(role)).Wait();
        }
    }

    var adminEmail = "admin@example.com";
    var adminPassword = "Admin@123";
    if (userManager.FindByEmailAsync(adminEmail).Result == null)
    {
        var adminUser = new User { UserName = "Admin", Email = adminEmail };
        var result = userManager.CreateAsync(adminUser, adminPassword).Result;
        if (result.Succeeded)
        {
            userManager.AddToRoleAsync(adminUser, "Admin").Wait();
        }
    }

    var sellerEmail = "seller@example.com";
    var sellerPassword = "Seller@123";
    if (userManager.FindByEmailAsync(sellerEmail).Result == null)
    {
        var sellerUser = new User { UserName = "Seller", Email = sellerEmail };
        var result = userManager.CreateAsync(sellerUser, sellerPassword).Result;
        if (result.Succeeded)
        {
            userManager.AddToRoleAsync(sellerUser, "Seller").Wait();
        }
    }

    var customerUserEmail = "bob@example.com";
    var customerUserPassword = "Customer@123";
    if (userManager.FindByEmailAsync(customerUserEmail).Result == null)
    {
        var customerUser = new User { UserName = "bobjohnson", Email = customerUserEmail };
        var result = userManager.CreateAsync(customerUser, customerUserPassword).Result;
        if (result.Succeeded)
        {
            userManager.AddToRoleAsync(customerUser, "Customer").Wait();
        }
    }
    
    
    var customers = new List<Customer>
    {
        new Customer { Name = "John Doe", Email = "john@example.com", Phone = "123456789", City = "City A", Country = "Address 1", PostalCode = "93290", State = "State A", Street = "Address 1" },
        new Customer { Name = "Jane Smith", Email = "jane@example.com", Phone = "987654321", City = "City B", Country = "Address 2", PostalCode = "32310", State = "State B", Street = "Address 2" },
        new Customer { Name = "Bob Johnson", Email = "bob@example.com", Phone = "456789123", City = "City C", Country = "Address 3", PostalCode = "65640", State = "State C", Street = "Address 3" },
    };
    context.Customers.AddRange(customers);

    var products = new List<Product>
    {
        new Product { Title = "RTX 4090 Rog Strix", Description = "NVIDIA Ada Lovelace Streaming Multiprocessors: Up to 2x performance and power efficiency", Price = 1979.99m, Quantity = 80, Status = "Active", Category = "GPU", Code = "P001", ImageUrl = "/uploads/4090.jpg" },
        new Product { Title = "Core i7-12700KF", Description = "Built for the Next Generation of Gaming. Game and multitask without compromise powered by Intel’s performance hybrid architecture on an unlocked processor.", Price = 189.98m, Quantity = 9, Status = "Active", Category = "Processor", Code = "P002", ImageUrl = "/uploads/i7.jpg" },
        new Product { Title = "Astro A10 Gaming Headset", Description = "Enhanced sound quality: ASTRO Gaming A10 Gen 2 Headset for PlayStation 5, PlayStation 4, Nintendo Switch, PC", Price = 48.00m, Quantity = 21, Status = "Active", Category = "Headset", Code = "P003", ImageUrl = "/uploads/headset.jpg" },
        new Product { Title = "Acer KB272 EBI 27' IPS Full HD", Description = "27' Full HD IPS (1920 x 1080) Monitor For Home, Gaming or Office", Price = 99.90m, Quantity = 12, Status = "Active", Category = "Monitor", Code = "P004", ImageUrl = "/uploads/monitor.jpg" },
        new Product { Title = "ASUS ROG Strix B550-A", Description = "AMD AM4 Socket and PCIe 4. 0: The perfect pairing for Zen 3 Ryzen 5000 and 3rd Gen AMD Ryzen", Price = 149.98m, Quantity = 46, Status = "Active", Category = "Motherboard", Code = "P005", ImageUrl = "/uploads/motherboard.jpg" },
        new Product { Title = "Logitech G305 LIGHTSPEED", Description = "HERO Gaming Sensor: Next-gen HERO mouse sensor delivers up to 10x the power efficiency", Price = 29.51m, Quantity = 6, Status = "Active", Category = "Mouse", Code = "P006", ImageUrl = "/uploads/mouse.jpg" },
        new Product { Title = "Kingston Fury Beast 32GB", Description = "Low-profile heat spreader design", Price = 69.99m, Quantity = 0, Status = "Active", Category = "Memory", Code = "P007", ImageUrl = "/uploads/ram.jpg" },
    };
    context.Products.AddRange(products);

    context.SaveChanges();

    var bobJohnson = context.Customers.First(c => c.Name == "Bob Johnson");
    var otherCustomers = context.Customers.Where(c => c.Name != "Bob Johnson").ToList();

    var orders = new List<Order>
    {
        new Order { CustomerId = bobJohnson.Id, SellerEmail = "seller@example.com", OrderDate = DateTime.Now.AddMonths(-1), Status = "SHIPPED", TotalAmount = 5000m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "RTX 4090 Rog Strix").Id, Quantity = 1 },
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Astro A10 Gaming Headset").Id, Quantity = 2 }
            }
        },
        new Order { CustomerId = bobJohnson.Id, SellerEmail = "seller@example.com", OrderDate = DateTime.Now.AddMonths(-1), Status = "PENDING", TotalAmount = 3000m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Core i7-12700KF").Id, Quantity = 1 },
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Logitech G305 LIGHTSPEED").Id, Quantity = 1 }
            }
        },
        new Order { CustomerId = bobJohnson.Id, SellerEmail = "seller@example.com", OrderDate = DateTime.Now, Status = "DELIVERED", TotalAmount = 4000m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Acer KB272 EBI 27' IPS Full HD").Id, Quantity = 2 }
            }
        },
        new Order { CustomerId = otherCustomers[0].Id, SellerEmail = "admin@example.com", OrderDate = DateTime.Now, Status = "SHIPPED", TotalAmount = 6000m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "ASUS ROG Strix B550-A").Id, Quantity = 2 }
            }
        },
        new Order { CustomerId = otherCustomers[1].Id, SellerEmail = "admin@example.com", OrderDate = DateTime.Now.AddMonths(-2), Status = "DELIVERED", TotalAmount = 2000m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Logitech G305 LIGHTSPEED").Id, Quantity = 3 }
            }
        },
        new Order { CustomerId = otherCustomers[1].Id, SellerEmail = "admin@example.com", OrderDate = DateTime.Now, Status = "DELIVERED", TotalAmount = 2500m, OrderProducts = new List<OrderProduct>
            {
                new OrderProduct { ProductId = context.Products.First(p => p.Title == "Kingston Fury Beast 32GB").Id, Quantity = 5 }
            }
        }
    };

    context.Orders.AddRange(orders);
    context.SaveChanges();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bytewave API V1");
    });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowSpecificOrigin");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
