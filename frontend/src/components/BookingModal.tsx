import React, { useState } from 'react';
import { Station, Charger, Booking } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Zap, Clock, ShieldCheck, CheckCircle2, CreditCard, Sparkles, QrCode } from 'lucide-react';

interface BookingModalProps {
  station: Station;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ station, isOpen, onClose, onBookingComplete }) => {
  const [selectedCharger, setSelectedCharger] = useState<Charger>(station.chargers[0] || {
    id: 'ch-01',
    serialNumber: 'CW-DT-01',
    type: 'Supercharger',
    maxPowerKw: 250,
    status: 'Available',
    priceRate: station.pricePerKwh
  });

  const [selectedTime, setSelectedTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Credit Card');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const estimatedKwh = Math.round((selectedCharger.maxPowerKw * (durationMinutes / 60)) * 0.75);
  const totalCost = Math.round(estimatedKwh * station.pricePerKwh);

  const handleConfirmBooking = () => {
    setLoading(true);

    setTimeout(() => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const booking: Booking = {
        id: `bkg-${Math.floor(Math.random() * 90000) + 10000}`,
        stationId: station.id,
        stationName: station.name,
        chargerSerial: selectedCharger.serialNumber,
        chargerType: selectedCharger.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        estimatedCost: totalCost,
        status: 'Confirmed',
        qrCodeToken: `CW-QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        transactionRef: `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
      };

      setConfirmedBooking(booking);
      setIsConfirmed(true);
      setLoading(false);
      onBookingComplete(booking);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">{station.name}</h2>
              <p className="text-[11px] text-slate-500">Smart Slot Reservation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 space-y-5">
            {/* Charger Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Charger Unit
              </label>
              <div className="grid grid-cols-2 gap-2">
                {station.chargers.map((charger) => (
                  <button
                    key={charger.id}
                    onClick={() => setSelectedCharger(charger)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCharger.id === charger.id
                        ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{charger.serialNumber}</span>
                      <span className="text-sky-600 text-[10px]">{charger.maxPowerKw} kW</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      {charger.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="14:00">14:00 (Immediate)</option>
                  <option value="14:30">14:30 PM</option>
                  <option value="15:00">15:00 PM</option>
                  <option value="16:00">16:00 PM (Off-Peak)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Charging Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Recommended)</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Method (Mock Gateway)
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>UPI / Credit Card / EV Fleet Wallet</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Estimated Charging Cost</div>
                <div className="text-xl font-extrabold text-white">₹{totalCost}.00</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3" /> Includes ~{estimatedKwh} kWh energy
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleConfirmBooking}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 font-bold text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {loading ? 'Confirming...' : 'Pay & Confirm Slot'}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation & QR Pass View */
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your charging slot has been locked. Scan QR at station dispenser.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
              <QRCodeSVG value={confirmedBooking?.qrCodeToken || 'DEMO-TOKEN'} size={150} />
              <div className="text-[11px] font-mono font-bold text-slate-700 mt-2">
                {confirmedBooking?.qrCodeToken}
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Charger Serial:</span>
                <span className="font-bold text-slate-800">{confirmedBooking?.chargerSerial}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transaction Ref:</span>
                <span className="font-bold text-slate-800">{confirmedBooking?.transactionRef}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done & View My Bookings
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
