using Microsoft.EntityFrameworkCore;
using ChargeWise.Core.Entities;

namespace ChargeWise.Infrastructure.Data
{
    public class ChargeWiseDbContext : DbContext
    {
        public ChargeWiseDbContext(DbContextOptions<ChargeWiseDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Station> Stations => Set<Station>();
        public DbSet<Charger> Chargers => Set<Charger>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<MLPredictionLog> MLPredictionLogs => Set<MLPredictionLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Station>(entity =>
            {
                entity.Property(s => s.PricePerKwh).HasPrecision(5, 2);
                entity.Property(s => s.Rating).HasPrecision(3, 2);
            });

            modelBuilder.Entity<Charger>(entity =>
            {
                entity.HasIndex(c => c.SerialNumber).IsUnique();
                entity.Property(c => c.MaxPowerKw).HasPrecision(5, 2);
                entity.Property(c => c.PriceRate).HasPrecision(5, 2);

                entity.HasOne(c => c.Station)
                      .WithMany(s => s.Chargers)
                      .HasForeignKey(c => c.StationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasIndex(b => b.QrCodeToken).IsUnique();
                entity.Property(b => b.EstimatedCost).HasPrecision(8, 2);

                entity.HasOne(b => b.User)
                      .WithMany(u => u.Bookings)
                      .HasForeignKey(b => b.UserId);

                entity.HasOne(b => b.Station)
                      .WithMany(s => s.Bookings)
                      .HasForeignKey(b => b.StationId);

                entity.HasOne(b => b.Charger)
                      .WithMany(c => c.Bookings)
                      .HasForeignKey(b => b.ChargerId);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasIndex(p => p.TransactionReference).IsUnique();
                entity.Property(p => p.Amount).HasPrecision(8, 2);

                entity.HasOne(p => p.Booking)
                      .WithOne(b => b.Payment)
                      .HasForeignKey<Payment>(p => p.BookingId);
            });
        }
    }
}
