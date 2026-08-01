using System;
using System.Collections.Generic;
using ChargeWise.Core.Enums;

namespace ChargeWise.Core.DTOs
{
    // Auth DTOs
    public record RegisterRequestDto(string FullName, string Email, string Password, string VehicleModel, int BatteryCapacityKwh, ChargerType PreferredConnector);
    public record LoginRequestDto(string Email, string Password);
    public record AuthResponseDto(string Token, string FullName, string Email, string Role, Guid UserId);

    // Station DTOs
    public class StationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Rating { get; set; }
        public int TotalChargers { get; set; }
        public int AvailableChargers { get; set; }
        public decimal PricePerKwh { get; set; }
        public string OperatorName { get; set; } = string.Empty;
        public double DistanceKm { get; set; }
        public double PredictedWaitMinutes { get; set; }
        public double RecommendationScore { get; set; }
        public List<ChargerDto> Chargers { get; set; } = new();
    }

    public class ChargerDto
    {
        public Guid Id { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal MaxPowerKw { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal PriceRate { get; set; }
    }

    // Booking DTOs
    public record CreateBookingDto(Guid ChargerId, Guid StationId, DateTime StartTime, DateTime EndTime, string PaymentMethod);
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid StationId { get; set; }
        public string StationName { get; set; } = string.Empty;
        public string ChargerSerial { get; set; } = string.Empty;
        public string ChargerType { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal EstimatedCost { get; set; }
        public string Status { get; set; } = string.Empty;
        public string QrCodeToken { get; set; } = string.Empty;
        public string TransactionRef { get; set; } = string.Empty;
    }

    // Route Planning DTOs
    public record RouteRequestDto(double OriginLat, double OriginLng, double DestLat, double DestLng, double CurrentSoc, int BatteryCapacityKwh, ChargerType PreferredConnector);
    public class RouteResponseDto
    {
        public double TotalDistanceKm { get; set; }
        public double TotalDurationMinutes { get; set; }
        public decimal EstimatedTotalCost { get; set; }
        public List<StationDto> RecommendedChargingStops { get; set; } = new();
        public List<double[]> RoutePolylinePoints { get; set; } = new();
        public BatteryAwareInfoDto BatteryInfo { get; set; } = default!;
    }

    public class BatteryAwareInfoDto
    {
        public double CurrentSocPercentage { get; set; }
        public double RemainingRangeKm { get; set; }
        public bool NeedsChargingEnroute { get; set; }
        public double RecommendedChargeKwh { get; set; }
        public string SuggestedChargerType { get; set; } = string.Empty;
    }

    // Admin & Analytics DTOs
    public class DashboardAnalyticsDto
    {
        public int TotalBookingsToday { get; set; }
        public int TotalActiveStations { get; set; }
        public decimal TotalRevenueMonth { get; set; }
        public double AverageChargerUtilization { get; set; }
        public double AverageWaitTimeMinutes { get; set; }
        public double MLModelAccuracyPercentage { get; set; }
        public List<RevenueTrendDto> RevenueTrends { get; set; } = new();
        public List<StationUtilizationDto> UtilizationHeatmap { get; set; } = new();
    }

    public record RevenueTrendDto(string Date, decimal Revenue);
    public record StationUtilizationDto(string StationName, double UtilizationPercentage);
}
