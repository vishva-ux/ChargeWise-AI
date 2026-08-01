using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChargeWise.Core.DTOs;
using ChargeWise.Core.Entities;

namespace ChargeWise.Core.Interfaces
{
    public interface IStationRepository
    {
        Task<IEnumerable<Station>> GetAllAsync();
        Task<Station?> GetByIdAsync(Guid id);
        Task<IEnumerable<Station>> GetNearbyAsync(double latitude, double longitude, double radiusKm);
        Task AddAsync(Station station);
        Task UpdateAsync(Station station);
        Task DeleteAsync(Guid id);
    }

    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId);
        Task<Booking?> GetByIdAsync(Guid id);
        Task<bool> HasConflictAsync(Guid chargerId, DateTime startTime, DateTime endTime);
        Task AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);
    }

    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(Guid id);
        Task AddAsync(User user);
    }

    public interface IMLIntegrationService
    {
        Task<double> GetWaitTimePredictionAsync(int dayOfWeek, int hourOfDay, int totalChargers, int occupancy);
        Task<List<StationDto>> GetRankedRecommendationsAsync(List<StationDto> stations, double userLat, double userLng, double soc, string connector);
        Task<BatteryAwareInfoDto> GetBatteryAwareRecommendationAsync(double soc, int batteryCapacity, double distanceKm);
    }

    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(Guid userId, CreateBookingDto dto);
        Task<bool> CancelBookingAsync(Guid userId, Guid bookingId);
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId);
    }

    public interface IRoutePlanningService
    {
        Task<RouteResponseDto> CalculateOptimalRouteAsync(RouteRequestDto request);
    }

    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
    }
}
