import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { Booking } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, Zap, CheckCircle2, XCircle, FileText, Download, QrCode } from 'lucide-react';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeQrBooking, setActiveQrBooking] = useState<Booking | null>(MOCK_BOOKINGS[0]);

  const handleCancelBooking = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? Slot will be released.')) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      if (activeQrBooking?.id === id) setActiveQrBooking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-600" />
            My Slot Reservations & History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your EV charging passes, view QR confirmation tokens, and download tax invoices.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
          Total Bookings: <span className="text-sky-600 font-extrabold">{bookings.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Bookings Feed (Left Pane) */}
        <div className="lg:col-span-7 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setActiveQrBooking(booking)}
              className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
                activeQrBooking?.id === booking.id
                  ? 'border-sky-500 shadow-md ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{booking.stationName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Charger: <strong className="text-slate-800">{booking.chargerSerial}</strong></span>
                    <span>•</span>
                    <span className="text-sky-600 font-semibold">{booking.chargerType}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                    booking.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : booking.status === 'Completed'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {booking.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {booking.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                  {booking.status}
                </span>
              </div>

              {/* Specs Row */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-xs border border-slate-100 mb-3">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Start Time</div>
                  <div className="font-bold text-slate-800">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Estimated Cost</div>
                  <div className="font-extrabold text-slate-900">₹{booking.estimatedCost}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Transaction Ref</div>
                  <div className="font-mono text-[11px] text-slate-600 truncate">{booking.transactionRef}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Generating Tax Invoice for transaction ${booking.transactionRef}...`);
                  }}
                  className="font-semibold text-slate-600 hover:text-sky-600 flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Download Invoice
                </button>

                {booking.status === 'Confirmed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelBooking(booking.id);
                    }}
                    className="font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* QR Code Pass Display (Right Pane) */}
        <div className="lg:col-span-5 sticky top-20">
          {activeQrBooking ? (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                <QrCode className="w-4 h-4 text-sky-600" /> Digital Dispenser Pass
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{activeQrBooking.stationName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Scan at dispenser unit to unlock charging</p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
                <QRCodeSVG value={activeQrBooking.qrCodeToken} size={180} />
                <div className="text-xs font-mono font-bold text-slate-800 mt-3 tracking-wider">
                  {activeQrBooking.qrCodeToken}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Dispenser Unit:</span>
                  <strong className="text-white">{activeQrBooking.chargerSerial}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Connector Standard:</span>
                  <strong className="text-sky-400">{activeQrBooking.chargerType}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Amount Paid:</span>
                  <strong className="text-emerald-400">₹{activeQrBooking.estimatedCost}.00</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-100 rounded-3xl text-center text-slate-400 text-xs">
              Select a booking from the list to view its QR code pass.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
