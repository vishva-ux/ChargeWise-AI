using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ChargeWise.API.Hubs;
using ChargeWise.API.Middleware;
using ChargeWise.Core.Interfaces;
using ChargeWise.Infrastructure.Data;
using ChargeWise.Infrastructure.Repositories;
using ChargeWise.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Services to DI Container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();

// Swagger Configuration with JWT Bearer
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ChargeWise AI - Enterprise Web API",
        Version = "v1",
        Description = "ASP.NET Core 8 REST API for EV Charging Station Locator, AI Route Planning, and Intelligent Slot Booking."
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token (e.g. Bearer eyJhbGci...)"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ChargeWiseDbContext>(options =>
    options.UseNpgsql(connectionString, o => o.UseNetTopologySuite()));

// Authentication & JWT
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "ChargeWiseSuperSecretEnterpriseKey2026!KeyLengthMin256Bits";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "ChargeWise",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "ChargeWiseUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// HttpClient for Python ML Service
builder.Services.AddHttpClient<IMLIntegrationService, MLIntegrationService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["MLServiceUrl"] ?? "http://localhost:8000");
});

// Dependency Injection Scopes
builder.Services.AddScoped<IStationRepository, StationRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IRoutePlanningService, RoutePlanningService>();

// CORS Setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChargeWise API v1"));
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<StationHub>("/hub/stations");

app.Run();
