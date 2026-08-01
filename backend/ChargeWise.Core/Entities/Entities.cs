using System;
using System.Collections.Generic;
using ChargeWise.Core.Enums;
using NetTopologySuite.Geometries;

namespace ChargeWise.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
        public string VehicleModel { get; set; } = "Tesla Model 3";
        public int BatteryCapacityKwh { get; set; } = 60;
        public ChargerType PreferredConnector { get; set; } = ChargerType.CCS2;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

    public class Station
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public Point Location { get; set; } = default!;
        public double Rating { get; set; } = 4.5;
        public int TotalChargers { get; set; } = 4;
        public int AvailableChargers { get; set; } = 4;
        public decimal PricePerKwh { get; set; } = 15.00m;
        public string OperatorName { get; set; } = "ChargeWise Network";
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Charger> Chargers { get; set; } = new List<Charger>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

    public class Charger
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StationId { get; set; }
        public Station Station { get; set; } = default!;

        public string SerialNumber { get; set; } = string.Empty;
        public ChargerType Type { get; set; } = ChargerType.CCS2;
        public decimal MaxPowerKw { get; set; } = 150.0m;
        public ChargerStatus Status { get; set; } = ChargerStatus.Available;
        public decimal PriceRate { get; set; } = 15.00m;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public Guid ChargerId { get; set; }
        public Charger Charger { get; set; } = default!;

        public Guid StationId { get; set; }
        public Station Station { get; set; } = default!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal EstimatedCost { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Confirmed;
        public string QrCodeToken { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Payment? Payment { get; set; }
    }

    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = default!;

        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "CreditCard";
        public PaymentStatus Status { get; set; } = PaymentStatus.Success;
        public string TransactionReference { get; set; } = string.Empty;
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }

    public class Review
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StationId { get; set; }
        public Station Station { get; set; } = default!;

        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class MLPredictionLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid? UserId { get; set; }
        public Guid? StationId { get; set; }
        public double PredictedWaitMinutes { get; set; }
        public double RecommendationScore { get; set; }
        public double AccuracyMetric { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
