namespace ChargeWise.Core.Enums
{
    public enum UserRole
    {
        User,
        Admin
    }

    public enum ChargerType
    {
        CCS2,
        Type2,
        CHAdeMO,
        Supercharger
    }

    public enum ChargerStatus
    {
        Available,
        Occupied,
        Maintenance,
        Offline
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    public enum PaymentStatus
    {
        Pending,
        Success,
        Failed,
        Refunded
    }
}
