using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChargeWise.API.Hubs
{
    public class StationHub : Hub
    {
        public async Task JoinStationGroup(string stationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Station_{stationId}");
        }

        public async Task LeaveStationGroup(string stationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Station_{stationId}");
        }

        public async Task BroadcastChargerStatusUpdate(string stationId, string chargerId, string newStatus)
        {
            await Clients.Group($"Station_{stationId}").SendAsync("ReceiveChargerStatus", stationId, chargerId, newStatus);
            await Clients.All.SendAsync("ReceiveGlobalAvailabilityUpdate", stationId);
        }
    }
}
