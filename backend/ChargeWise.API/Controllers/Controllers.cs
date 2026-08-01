using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChargeWise.Core.DTOs;
using ChargeWise.Core.Interfaces;

namespace ChargeWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var res = await _authService.RegisterAsync(dto);
            return Ok(res);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var res = await _authService.LoginAsync(dto);
            return Ok(res);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class StationsController : ControllerBase
    {
        private readonly IStationRepository _stationRepo;
        private readonly IMLIntegrationService _mlService;

        public StationsController(IStationRepository stationRepo, IMLIntegrationService mlService)
        {
            _stationRepo = stationRepo;
            _mlService = mlService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] double? lat, [FromQuery] double? lng, [FromQuery] double? radiusKm)
        {
            IEnumerable<Core.Entities.Station> stations;
            if (lat.HasValue && lng.HasValue)
            {
                stations = await _stationRepo.GetNearbyAsync(lat.Value, lng.Value, radiusKm ?? 25.0);
            }
            else
            {
                stations = await _stationRepo.GetAllAsync();
            }

            var dtos = new List<StationDto>();
            var now = DateTime.Now;

            foreach (var s in stations)
            {
                var occ = s.TotalChargers - s.AvailableChargers;
                var waitTime = await _mlService.GetWaitTimePredictionAsync((int)now.DayOfWeek, now.Hour, s.TotalChargers, occ);

                dtos.Add(new StationDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    Latitude = s.Location?.Y ?? 12.9716,
                    Longitude = s.Location?.X ?? 77.5946,
                    Rating = s.Rating,
                    TotalChargers = s.TotalChargers,
                    AvailableChargers = s.AvailableChargers,
                    PricePerKwh = s.PricePerKwh,
                    OperatorName = s.OperatorName,
                    DistanceKm = lat.HasValue && lng.HasValue ? Math.Round(Math.Sqrt(Math.Pow(s.Location.Y - lat.Value, 2) + Math.Pow(s.Location.X - lng.Value, 2)) * 111.0, 1) : 3.5,
                    PredictedWaitMinutes = waitTime,
                    Chargers = s.Chargers.Select(c => new ChargerDto
                    {
                        Id = c.Id,
                        SerialNumber = c.SerialNumber,
                        Type = c.Type.ToString(),
                        MaxPowerKw = c.MaxPowerKw,
                        Status = c.Status.ToString(),
                        PriceRate = c.PriceRate
                    }).ToList()
                });
            }

            if (lat.HasValue && lng.HasValue)
            {
                dtos = await _mlService.GetRankedRecommendationsAsync(dtos, lat.Value, lng.Value, 30.0, "CCS2");
            }

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var s = await _stationRepo.GetByIdAsync(id);
            if (s == null) return NotFound();
            return Ok(s);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var booking = await _bookingService.CreateBookingAsync(userId, dto);
            return Ok(booking);
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var success = await _bookingService.CancelBookingAsync(userId, id);
            if (!success) return BadRequest("Unable to cancel booking.");
            return Ok(new { message = "Booking cancelled successfully." });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly IRoutePlanningService _routeService;

        public RouteController(IRoutePlanningService routeService)
        {
            _routeService = routeService;
        }

        [HttpPost("plan")]
        public async Task<IActionResult> PlanRoute([FromBody] RouteRequestDto dto)
        {
            var route = await _routeService.CalculateOptimalRouteAsync(dto);
            return Ok(route);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MLController : ControllerBase
    {
        private readonly IMLIntegrationService _mlService;

        public MLController(IMLIntegrationService mlService)
        {
            _mlService = mlService;
        }

        [HttpGet("predict-wait")]
        public async Task<IActionResult> PredictWaitTime([FromQuery] int day, [FromQuery] int hour, [FromQuery] int total, [FromQuery] int occ)
        {
            var wait = await _mlService.GetWaitTimePredictionAsync(day, hour, total, occ);
            return Ok(new { predictedWaitMinutes = wait });
        }

        [HttpGet("battery-recommendation")]
        public async Task<IActionResult> BatteryRecommendation([FromQuery] double soc, [FromQuery] int capacity, [FromQuery] double distance)
        {
            var res = await _mlService.GetBatteryAwareRecommendationAsync(soc, capacity, distance);
            return Ok(res);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet("analytics")]
        public IActionResult GetAnalytics()
        {
            var analytics = new DashboardAnalyticsDto
            {
                TotalBookingsToday = 142,
                TotalActiveStations = 18,
                TotalRevenueMonth = 48520.00m,
                AverageChargerUtilization = 74.8,
                AverageWaitTimeMinutes = 4.2,
                MLModelAccuracyPercentage = 94.6,
                RevenueTrends = new List<RevenueTrendDto>
                {
                    new("Mon", 6200),
                    new("Tue", 7100),
                    new("Wed", 6800),
                    new("Thu", 8400),
                    new("Fri", 9200),
                    new("Sat", 11500),
                    new("Sun", 10800)
                },
                UtilizationHeatmap = new List<StationUtilizationDto>
                {
                    new("Downtown Supercharge Hub", 88.5),
                    new("Tech Park Fast Charging", 79.2),
                    new("Airport Express Plaza", 91.0),
                    new("Metro Station EV Hub", 64.0),
                    new("Suburban EcoCharge", 51.5)
                }
            };

            return Ok(analytics);
        }
    }
}
