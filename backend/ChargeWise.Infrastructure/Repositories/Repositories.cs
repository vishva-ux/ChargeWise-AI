using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ChargeWise.Core.Entities;
using ChargeWise.Core.Interfaces;
using ChargeWise.Infrastructure.Data;
using NetTopologySuite.Geometries;

namespace ChargeWise.Infrastructure.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly ChargeWiseDbContext _db;

        public StationRepository(ChargeWiseDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Station>> GetAllAsync()
        {
            return await _db.Stations
                .Include(s => s.Chargers)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Station?> GetByIdAsync(Guid id)
        {
            return await _db.Stations
                .Include(s => s.Chargers)
                .Include(s => s.Reviews)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Station>> GetNearbyAsync(double latitude, double longitude, double radiusKm)
        {
            // Spatial distance query
            var userPoint = new Point(longitude, latitude) { SRID = 4326 };

            return await _db.Stations
                .Include(s => s.Chargers)
                .Where(s => s.IsActive && s.Location.Distance(userPoint) <= (radiusKm * 1000.0))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(Station station)
        {
            await _db.Stations.AddAsync(station);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Station station)
        {
            _db.Stations.Update(station);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var station = await _db.Stations.FindAsync(id);
            if (station != null)
            {
                _db.Stations.Remove(station);
                await _db.SaveChangesAsync();
            }
        }
    }

    public class BookingRepository : IBookingRepository
    {
        private readonly ChargeWiseDbContext _db;

        public BookingRepository(ChargeWiseDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
        {
            return await _db.Bookings
                .Include(b => b.Station)
                .Include(b => b.Charger)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.StartTime)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
        {
            return await _db.Bookings
                .Include(b => b.Station)
                .Include(b => b.Charger)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<bool> HasConflictAsync(Guid chargerId, DateTime startTime, DateTime endTime)
        {
            return await _db.Bookings.AnyAsync(b =>
                b.ChargerId == chargerId &&
                b.Status != Core.Enums.BookingStatus.Cancelled &&
                ((startTime >= b.StartTime && startTime < b.EndTime) ||
                 (endTime > b.StartTime && endTime <= b.EndTime) ||
                 (startTime <= b.StartTime && endTime >= b.EndTime)));
        }

        public async Task AddAsync(Booking booking)
        {
            await _db.Bookings.AddAsync(booking);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Booking booking)
        {
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync();
        }
    }

    public class UserRepository : IUserRepository
    {
        private readonly ChargeWiseDbContext _db;

        public UserRepository(ChargeWiseDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task AddAsync(User user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }
    }
}
