import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Zap, Clock, ShieldCheck, CheckCircle2, ChevronRight, ArrowLeft, 
  CreditCard, Wallet, Smartphone, Sparkles, MapPin, AlertCircle, Info, Lock
} from 'lucide-react';
import { ChargingStation, calculatePricing, ExtractedAIQuery } from '../utils/aiEngine';

type SheetPanel = 'PANEL_A_DISCOVERY' | 'PANEL_B_CHECKOUT' | 'PANEL_C_PASS';
type PaymentMethod = 'UPI' | 'CARD' | 'FLEET_WALLET';

interface RapidoBottomSheetProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (st: ChargingStation) => void;
  aiQueryResult: ExtractedAIQuery | null;
  onResetSearch?: () => void;
}

export const RapidoBottomSheet: React.FC<RapidoBottomSheetProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  aiQueryResult,
  onResetSearch,
}) => {
  const [activePanel, setActivePanel] = useState<SheetPanel>('PANEL_A_DISCOVERY');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI');
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [confirmedPassId, setConfirmedPassId] = useState<string>('');

  // Target station to operate on
  const currentTargetStation = selectedStation || stations[0] || null;

  // Handle proceed to checkout
  const handleProceedToCheckout = (station: ChargingStation) => {
    onSelectStation(station);
    setActivePanel('PANEL_B_CHECKOUT');
  };

  // Handle payment confirmation & Redisson distributed lock execution
  const handleConfirmReservation = () => {
    setIsProcessingBooking(true);
    // Simulate Redisson distributed lock + atomic Spring Boot transaction
    setTimeout(() => {
      const passId = `CW-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedPassId(passId);
      setIsProcessingBooking(false);
      setActivePanel('PANEL_C_PASS');
    }, 1200);
  };

  // Handle reset back to map discovery
  const handleBackToDiscovery = () => {
    setActivePanel('PANEL_A_DISCOVERY');
  };

  if (!currentTargetStation) return null;

  const pricing = calculatePricing(currentTargetStation);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out">
      {/* Sliding Bottom Sheet Container */}
      <div className="rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] bg-white border-t border-slate-100 overflow-hidden max-h-[82vh] flex flex-col">
        
        {/* Top Handle Drag Indicator Bar */}
        <div className="w-full pt-3 pb-1 flex justify-center items-center bg-white cursor-grab">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        {/* Dynamic Insights Banner */}
        {aiQueryResult && activePanel === 'PANEL_A_DISCOVERY' && (
          <div className="mx-4 mb-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] text-slate-800">
              <span className="font-bold text-emerald-950 block mb-0.5">
                Route Optimizer Summary
              </span>
              <p className="text-slate-700 leading-snug">{aiQueryResult.ragAnswer}</p>
            </div>
            {onResetSearch && (
              <button
                onClick={onResetSearch}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline flex-shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL A: DISCOVERY VIEW (Horizontal Carousel + Cards) */}
        {/* ------------------------------------------------------------- */}
        {activePanel === 'PANEL_A_DISCOVERY' && (
          <div className="p-4 pt-1 space-y-3.5 overflow-y-auto no-scrollbar">
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#344055] fill-[#344055]" />
                  Nearby Charging Hubs
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Live Distance Sorting • Real-time Slot Availability
                </p>
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                {stations.length} Hubs Found
              </span>
            </div>

            {/* Horizontal Station Cards Carousel */}
            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
              {stations.map((st) => {
                const isSelected = currentTargetStation.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => onSelectStation(st)}
                    className={`flex-shrink-0 w-[270px] bg-white rounded-2xl p-3.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#344055] ring-2 ring-slate-900/10 shadow-md bg-slate-50/50'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Top Row: Distance & Wait Time Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase bg-[#344055] text-white px-2 py-0.5 rounded-md">
                        {st.distanceKm} km away
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        ~{st.predictedWaitTimeMins}m wait
                      </span>
                    </div>

                    {/* Station Name & Address */}
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 mb-1">
                      {st.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">
                      {st.address}
                    </p>

                    {/* Specifications badges */}
                    <div className="flex items-center space-x-1.5 mb-3">
                      <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        ⚡ {st.powerKw} kW
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {st.connectorType}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 ml-auto">
                        ₹{st.pricePerKwh}/kWh
                      </span>
                    </div>

                    {/* Action Button: Book Slot */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProceedToCheckout(st);
                      }}
                      className="w-full bg-[#344055] hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center space-x-1 uppercase tracking-wider"
                    >
                      <span>BOOK SLOT</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL B: RAPIDO CHECKOUT INTERFACE */}
        {/* ------------------------------------------------------------- */}
        {activePanel === 'PANEL_B_CHECKOUT' && (
          <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
            {/* Top Bar with Back Button */}
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <button
                onClick={handleBackToDiscovery}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Rapido Checkout Overview</h3>
                <p className="text-[11px] text-slate-500">{currentTargetStation.name}</p>
              </div>
            </div>

            {/* Line-item Fee Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Base Slot Reservation Fee</span>
                <span className="font-bold text-slate-800">₹{pricing.baseReservationFee}.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Est. Charging Tariff (~25 kWh @ ₹{pricing.pricePerKwh}/kWh)</span>
                <span className="font-bold text-slate-800">₹{pricing.estimatedTariff}.00</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                <span>Total Payable Amount</span>
                <span className="text-amber-600 text-base">₹{pricing.totalAmount}.00</span>
              </div>
            </div>

            {/* Payment Method Radio Group (Rapido Inspired) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Payment Method
              </label>

              {/* Option 1: UPI */}
              <label
                onClick={() => setSelectedPayment('UPI')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'UPI'
                    ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">UPI (Google Pay / PhonePe)</div>
                    <div className="text-[10px] text-slate-500">Instant direct bank authorization</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'UPI'}
                  onChange={() => setSelectedPayment('UPI')}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                />
              </label>

              {/* Option 2: Fleet Wallet Balance */}
              <label
                onClick={() => setSelectedPayment('FLEET_WALLET')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'FLEET_WALLET'
                    ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">EV Fleet Wallet Balance</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Available: ₹2,450.00</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'FLEET_WALLET'}
                  onChange={() => setSelectedPayment('FLEET_WALLET')}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                />
              </label>

              {/* Option 3: Credit / Debit Card */}
              <label
                onClick={() => setSelectedPayment('CARD')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'CARD'
                    ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                    <div className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'CARD'}
                  onChange={() => setSelectedPayment('CARD')}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                />
              </label>
            </div>

            {/* Action Button: Proceed to Secure Reservation */}
            <button
              onClick={handleConfirmReservation}
              disabled={isProcessingBooking}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2 tracking-wider uppercase"
            >
              {isProcessingBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Redisson Lock...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>PROCEED TO SECURE RESERVATION</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL C: FAKE QR CODE & SECURE PASS GENERATION */}
        {/* ------------------------------------------------------------- */}
        {activePanel === 'PANEL_C_PASS' && (
          <div className="p-5 text-center space-y-4 overflow-y-auto no-scrollbar">
            {/* Animated Green Checkmark Header */}
            <div className="flex flex-col items-center justify-center pt-1">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-inner ring-4 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-slate-500">
                Redisson lock verified • Slot reserved for 60 mins
              </p>
            </div>

            {/* Stylized QR Code Graphic Container with Reticle Brackets */}
            <div className="relative inline-block p-4 bg-slate-950 rounded-2xl shadow-xl border border-slate-800 mx-auto">
              {/* Reticle Brackets */}
              <div className="reticle-bracket reticle-tl"></div>
              <div className="reticle-bracket reticle-tr"></div>
              <div className="reticle-bracket reticle-bl"></div>
              <div className="reticle-bracket reticle-br"></div>

              {/* QR Matrix Wrapper */}
              <div className="p-3 bg-white rounded-xl shadow-inner relative overflow-hidden">
                <QRCodeSVG
                  value={`CHARGEWISE-PASS:${confirmedPassId}:${currentTargetStation.id}`}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* Transactional Metadata Payload */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Pass Identifier:</span>
                <span className="font-mono font-bold text-amber-600">{confirmedPassId}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Station Terminal Node:</span>
                <span className="font-bold text-slate-900 line-clamp-1">{currentTargetStation.name}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Time-Slot Window:</span>
                <span className="font-bold text-emerald-700">Immediate Access (60m)</span>
              </div>
            </div>

            {/* Pulsing Status Text */}
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Scan pass at physical charger kiosk to activate power supply</span>
            </div>

            {/* Action Button: Return to Map */}
            <button
              onClick={handleBackToDiscovery}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-colors uppercase tracking-wider"
            >
              Done & Return to Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
