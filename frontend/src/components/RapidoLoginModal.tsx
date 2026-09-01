import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, CheckCircle2, Car, Bike, Truck } from 'lucide-react';

interface RapidoLoginModalProps {
  onLoginSuccess: (userData: { phone: string; vehicleType: string }) => void;
}

export const RapidoLoginModal: React.FC<RapidoLoginModalProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [vehicleType, setVehicleType] = useState<'EV Car' | 'EV Fleet Cab' | 'EV Scooter'>('EV Fleet Cab');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter 4-digit OTP');
      return;
    }
    onLoginSuccess({
      phone: `+91 ${phone}`,
      vehicleType,
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#65C5B0] flex flex-col justify-between p-6 text-slate-800 animate-fadeIn">
      {/* Top Branding Section */}
      <div className="pt-8 space-y-4">
        {/* App Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#344055] flex items-center justify-center text-white shadow-lg">
            <Zap className="w-7 h-7 fill-white stroke-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">ChargeWise</h1>
            <p className="text-xs font-semibold text-slate-700">EV Station & Route Booking</p>
          </div>
        </div>

        {/* Welcome Tagline Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60">
          <h2 className="text-lg font-black text-slate-900 leading-snug">
            {step === 'PHONE' ? 'Enter Mobile Number to Continue' : 'Verify 4-Digit OTP'}
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {step === 'PHONE'
              ? 'Book nearby EV charging slots & plan optimal route stops instantly.'
              : `Verification code sent to +91 ${phone}`}
          </p>
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 my-auto space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 rounded-xl border border-rose-200 text-center">
            {errorMsg}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-100 px-3 py-3 rounded-xl font-extrabold text-xs text-slate-700 border border-slate-200">
                  +91 🇮🇳
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-slate-50 text-slate-900 font-bold text-sm px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#344055]"
                />
              </div>
            </div>

            {/* Vehicle Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Select Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('EV Fleet Cab')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-center transition-all ${
                    vehicleType === 'EV Fleet Cab'
                      ? 'border-[#344055] bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Fleet Cab</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('EV Car')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-center transition-all ${
                    vehicleType === 'EV Car'
                      ? 'border-[#344055] bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-[10px] font-bold">EV Car</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('EV Scooter')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-center transition-all ${
                    vehicleType === 'EV Scooter'
                      ? 'border-[#344055] bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                  <span className="text-[10px] font-bold">EV 2-Wheeler</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#344055] hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2 tracking-wider uppercase"
            >
              <span>SEND OTP CODE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* 4 Digit OTP Inputs */}
            <div className="space-y-2 text-center">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const nextOtp = [...otp];
                      nextOtp[idx] = val;
                      setOtp(nextOtp);
                    }}
                    className="w-12 h-14 bg-slate-50 text-center font-black text-lg text-slate-900 border-2 border-slate-300 rounded-xl focus:border-[#344055] focus:outline-none"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500">Auto-generated OTP: 1 2 3 4</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#344055] hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2 tracking-wider uppercase"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VERIFY & EXPLORE STATIONS</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-700 font-medium">
        <ShieldCheck className="w-4 h-4 inline-block mr-1 text-slate-800" />
        Secure Rapido OTP Booking Protocol
      </div>
    </div>
  );
};
