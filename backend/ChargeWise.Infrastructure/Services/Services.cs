using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ChargeWise.Core.DTOs;
using ChargeWise.Core.Entities;
using ChargeWise.Core.Enums;
using ChargeWise.Core.Interfaces;

namespace ChargeWise.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new InvalidOperationException("User with this email already exists.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.User,
                VehicleModel = dto.VehicleModel,
                BatteryCapacityKwh = dto.BatteryCapacityKwh,
                PreferredConnector = dto.PreferredConnector
            };

            await _userRepository.AddAsync(user);

            var token = GenerateJwtToken(user);
            return new AuthResponseDto(token, user.FullName, user.Email, user.Role.ToString(), user.Id);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            var token = GenerateJwtToken(user);
            return new AuthResponseDto(token, user.FullName, user.Email, user.Role.ToString(), user.Id);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"] ?? "ChargeWiseSuperSecretEnterpriseKey2026!KeyLengthMin256Bits"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "ChargeWise",
                audience: _config["Jwt:Audience"] ?? "ChargeWiseUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IStationRepository _stationRepo;

        public BookingService(IBookingRepository bookingRepo, IStationRepository stationRepo)
        {
            _bookingRepo = bookingRepo;
            _stationRepo = stationRepo;
        }

        public async Task<BookingDto> CreateBookingAsync(Guid userId, CreateBookingDto dto)
        {
            // Double-booking check
            bool hasConflict = await _bookingRepo.HasConflictAsync(dto.ChargerId, dto.StartTime, dto.EndTime);
            if (hasConflict)
            {
                throw new InvalidOperationException("Selected charger is already booked for this time slot. Please choose another time slot or charger.");
            }

            var station = await _stationRepo.GetByIdAsync(dto.StationId);
            if (station == null) throw new KeyNotFoundException("Charging station not found.");

            var charger = station.Chargers.FirstOrDefault(c => c.Id == dto.ChargerId);
            if (charger == null) throw new KeyNotFoundException("Charger unit not found.");

            var durationHours = (dto.EndTime - dto.StartTime).TotalHours;
            var estimatedKwh = (double)charger.MaxPowerKw * durationHours * 0.7; // 70% avg power curve
            var cost = (decimal)estimatedKwh * station.PricePerKwh;

            var qrToken = $"CW-QR-{Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()}";
            var txnRef = $"TXN-{Guid.NewGuid().ToString("N").Substring(0, 12).ToUpper()}";

            var booking = new Booking
            {
                UserId = userId,
                StationId = dto.StationId,
                ChargerId = dto.ChargerId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                EstimatedCost = Math.Round(cost, 2),
                Status = BookingStatus.Confirmed,
                QrCodeToken = qrToken,
                Payment = new Payment
                {
                    Amount = Math.Round(cost, 2),
                    PaymentMethod = dto.PaymentMethod,
                    Status = PaymentStatus.Success,
                    TransactionReference = txnRef
                }
            };

            await _bookingRepo.AddAsync(booking);

            return new BookingDto
            {
                Id = booking.Id,
                StationId = station.Id,
                StationName = station.Name,
                ChargerSerial = charger.SerialNumber,
                ChargerType = charger.Type.ToString(),
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                EstimatedCost = booking.EstimatedCost,
                Status = booking.Status.ToString(),
                QrCodeToken = booking.QrCodeToken,
                TransactionRef = txnRef
            };
        }

        public async Task<bool> CancelBookingAsync(Guid userId, Guid bookingId)
        {
            var booking = await _bookingRepo.GetByIdAsync(bookingId);
            if (booking == null || booking.UserId != userId) return false;

            booking.Status = BookingStatus.Cancelled;
            if (booking.Payment != null) booking.Payment.Status = PaymentStatus.Refunded;

            await _bookingRepo.UpdateAsync(booking);
            return true;
        }

        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId)
        {
            var list = await _bookingRepo.GetByUserIdAsync(userId);
            return list.Select(b => new BookingDto
            {
                Id = b.Id,
                StationId = b.StationId,
                StationName = b.Station.Name,
                ChargerSerial = b.Charger.SerialNumber,
                ChargerType = b.Charger.Type.ToString(),
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                EstimatedCost = b.EstimatedCost,
                Status = b.Status.ToString(),
                QrCodeToken = b.QrCodeToken,
                TransactionRef = b.Payment?.TransactionReference ?? "N/A"
            });
        }
    }

    public class MLIntegrationService : IMLIntegrationService
    {
        private readonly HttpClient _httpClient;

        public MLIntegrationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<double> GetWaitTimePredictionAsync(int dayOfWeek, int hourOfDay, int totalChargers, int occupancy)
        {
            try
            {
                var payload = new { day_of_week = dayOfWeek, hour_of_day = hourOfDay, total_chargers = totalChargers, current_occupancy = occupancy };
                var res = await _httpClient.PostAsJsonAsync("/predict/waiting-time", payload);
                if (res.IsSuccessStatusCode)
                {
                    var data = await res.Content.ReadFromJsonAsync<Dictionary<string, object>>();
                    if (data != null && data.TryGetValue("predicted_wait_minutes", out var val))
                    {
                        return Convert.ToDouble(val);
                    }
                }
            }
            catch
            {
                // Fallback heuristic if ML service unavailable
            }

            var util = (double)occupancy / Math.Max(totalChargers, 1);
            return util > 0.75 ? Math.Round((util - 0.7) * 35.0, 1) : 0.0;
        }

        public async Task<List<StationDto>> GetRankedRecommendationsAsync(List<StationDto> stations, double userLat, double userLng, double soc, string connector)
        {
            try
            {
                var payload = new
                {
                    user_lat = userLat,
                    user_lng = userLng,
                    battery_soc = soc,
                    preferred_connector = connector,
                    stations = stations.Select(s => new
                    {
                        id = s.Id.ToString(),
                        name = s.Name,
                        max_power_kw = s.Chargers.FirstOrDefault()?.MaxPowerKw ?? 150.0m,
                        price_per_kwh = s.PricePerKwh,
                        distance_km = s.DistanceKm,
                        rating = s.Rating,
                        predicted_wait_minutes = s.PredictedWaitMinutes,
                        connector_type = connector
                    })
                };

                var res = await _httpClient.PostAsJsonAsync("/recommend/stations", payload);
                if (res.IsSuccessStatusCode)
                {
                    var ranked = await res.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
                    if (ranked != null)
                    {
                        foreach (var item in ranked)
                        {
                            var stIdStr = item["id"].ToString();
                            var target = stations.FirstOrDefault(s => s.Id.ToString() == stIdStr);
                            if (target != null && item.TryGetValue("recommendation_score", out var scoreVal))
                            {
                                target.RecommendationScore = Convert.ToDouble(scoreVal);
                            }
                        }
                    }
                }
            }
            catch
            {
                // Fallback score computation
                foreach (var s in stations)
                {
                    s.RecommendationScore = Math.Round(Math.Max(10.0, 95.0 - (s.DistanceKm * 2.0) - (s.PredictedWaitMinutes * 1.5)), 1);
                }
            }

            return stations.OrderByDescending(s => s.RecommendationScore).ToList();
        }

        public async Task<BatteryAwareInfoDto> GetBatteryAwareRecommendationAsync(double soc, int batteryCapacity, double distanceKm)
        {
            try
            {
                var payload = new { current_soc = soc, battery_capacity_kwh = (double)batteryCapacity, destination_distance_km = distanceKm };
                var res = await _httpClient.PostAsJsonAsync("/recommend/battery-aware", payload);
                if (res.IsSuccessStatusCode)
                {
                    var data = await res.Content.ReadFromJsonAsync<BatteryAwareInfoDto>();
                    if (data != null) return data;
                }
            }
            catch { }

            var remainingKm = Math.Round(soc / 100.0 * batteryCapacity * 6.0, 1);
            return new BatteryAwareInfoDto
            {
                CurrentSocPercentage = soc,
                RemainingRangeKm = remainingKm,
                NeedsChargingEnroute = remainingKm < (distanceKm + 15.0),
                RecommendedChargeKwh = Math.Max(0.0, Math.Round((80.0 - soc) / 100.0 * batteryCapacity, 1)),
                SuggestedChargerType = soc < 30 ? "Supercharger" : "CCS2"
            };
        }
    }

    public class RoutePlanningService : IRoutePlanningService
    {
        private readonly IStationRepository _stationRepo;
        private readonly IMLIntegrationService _mlService;

        public RoutePlanningService(IStationRepository stationRepo, IMLIntegrationService mlService)
        {
            _stationRepo = stationRepo;
            _mlService = mlService;
        }

        public async Task<RouteResponseDto> CalculateOptimalRouteAsync(RouteRequestDto req)
        {
            // Calculate Haversine distance
            double distanceKm = CalculateHaversineDistance(req.OriginLat, req.OriginLng, req.DestLat, req.DestLng);
            double travelTimeMinutes = Math.Round((distanceKm / 50.0) * 60.0, 0); // Avg speed 50 km/h

            var batteryInfo = await _mlService.GetBatteryAwareRecommendationAsync(req.CurrentSoc, req.BatteryCapacityKwh, distanceKm);

            // Fetch stations along route
            var allStations = await _stationRepo.GetAllAsync();
            var stopCandidates = allStations.Select(s => new StationDto
            {
                Id = s.Id,
                Name = s.Name,
                Address = s.Address,
                Latitude = s.Location.Y,
                Longitude = s.Location.X,
                Rating = s.Rating,
                TotalChargers = s.TotalChargers,
                AvailableChargers = s.AvailableChargers,
                PricePerKwh = s.PricePerKwh,
                OperatorName = s.OperatorName,
                DistanceKm = Math.Round(CalculateHaversineDistance(req.OriginLat, req.OriginLng, s.Location.Y, s.Location.X), 1)
            }).Where(s => s.DistanceKm > 2.0 && s.DistanceKm < distanceKm).ToList();

            var rankedStops = await _mlService.GetRankedRecommendationsAsync(stopCandidates, req.OriginLat, req.OriginLng, req.CurrentSoc, req.PreferredConnector.ToString());
            var selectedStops = batteryInfo.NeedsChargingEnroute ? rankedStops.Take(2).ToList() : new List<StationDto>();

            var totalChargingCost = (decimal)batteryInfo.RecommendedChargeKwh * 16.50m;

            // Generate route polyline interpolation
            var polyline = InterpolateRoutePoints(req.OriginLat, req.OriginLng, req.DestLat, req.DestLng, selectedStops);

            return new RouteResponseDto
            {
                TotalDistanceKm = Math.Round(distanceKm, 1),
                TotalDurationMinutes = travelTimeMinutes + (selectedStops.Count * 25.0),
                EstimatedTotalCost = Math.Round(totalChargingCost, 2),
                RecommendedChargingStops = selectedStops,
                RoutePolylinePoints = polyline,
                BatteryInfo = batteryInfo
            };
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double r = 6371; // Earth radius in km
            double dLat = (lat2 - lat1) * Math.PI / 180.0;
            double dLon = (lon2 - lon1) * Math.PI / 180.0;
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return r * c;
        }

        private List<double[]> InterpolateRoutePoints(double lat1, double lon1, double lat2, double lon2, List<StationDto> stops)
        {
            var points = new List<double[]> { new double[] { lat1, lon1 } };

            foreach (var stop in stops)
            {
                points.Add(new double[] { stop.Latitude, stop.Longitude });
            }

            points.Add(new double[] { lat2, lon2 });
            return points;
        }
    }
}
