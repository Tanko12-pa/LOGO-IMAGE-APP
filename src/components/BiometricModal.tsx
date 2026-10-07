import React, { useState, useEffect } from 'react';
import { Fingerprint, Scan, ShieldCheck, Lock, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  reason?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Biometric Authentication',
  reason = 'Verify your identity to access secured brand assets and cloud workspace',
}) => {
  const [authMode, setAuthMode] = useState<'fingerprint' | 'faceid' | 'pin'>('fingerprint');
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setScanning(false);
      setPinCode('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setStatus('scanning');
    setErrorMessage('');

    setTimeout(() => {
      setScanning(false);
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length >= 4) {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setErrorMessage('Please enter at least 4 digits');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-center overflow-hidden">
        {/* Ambient Top Glow using user's brand colors: #800020 and #F27430 */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] blur-3xl opacity-30 pointer-events-none" />

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F27430]" />
          <span>Biometric Passkey Protection</span>
        </div>

        <h3 className="text-xl font-bold font-heading text-white">{title}</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">{reason}</p>

        {/* Biometric Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 mt-5">
          <button
            type="button"
            onClick={() => { setAuthMode('fingerprint'); setStatus('idle'); }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              authMode === 'fingerprint' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            Touch ID
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('faceid'); setStatus('idle'); }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              authMode === 'faceid' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            Face ID
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setStatus('idle'); }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              authMode === 'pin' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            PIN Code
          </button>
        </div>

        {/* Interactive Scanner Area */}
        <div className="my-6 flex flex-col items-center justify-center">
          {authMode === 'fingerprint' && (
            <div className="relative group">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={scanning || status === 'success'}
                aria-label="Scan Fingerprint"
                className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  status === 'success'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : scanning
                    ? 'border-[#F27430] bg-[#F27430]/10 text-[#FFE566] ring-4 ring-[#F27430]/20'
                    : 'border-zinc-700 bg-zinc-900/60 hover:border-[#800020] text-zinc-300 hover:text-white'
                }`}
              >
                {/* Scanner laser bar animation */}
                {scanning && (
                  <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#FFE566] to-transparent animate-scanline pointer-events-none" />
                )}

                {status === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in" />
                ) : (
                  <Fingerprint className={`w-14 h-14 ${scanning ? 'animate-pulse text-[#F27430]' : ''}`} />
                )}
              </button>
              <div className="text-xs text-zinc-400 mt-3 font-mono">
                {scanning ? 'Verifying biometric telemetry...' : status === 'success' ? 'Authenticated' : 'Tap sensor to authenticate'}
              </div>
            </div>
          )}

          {authMode === 'faceid' && (
            <div className="relative group">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={scanning || status === 'success'}
                aria-label="Scan Face"
                className={`relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                  status === 'success'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : scanning
                    ? 'border-[#F27430] bg-[#800020]/20 text-[#FFE566] ring-4 ring-[#F27430]/20'
                    : 'border-zinc-700 bg-zinc-900/60 hover:border-[#F27430] text-zinc-300'
                }`}
              >
                {scanning && (
                  <div className="absolute inset-0 border-2 border-dashed border-[#FFE566] rounded-2xl animate-spin duration-700 pointer-events-none" />
                )}
                {status === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in" />
                ) : (
                  <Scan className={`w-12 h-12 ${scanning ? 'scale-110 text-[#F27430]' : ''}`} />
                )}
              </button>
              <div className="text-xs text-zinc-400 mt-3 font-mono">
                {scanning ? 'Aligning facial mesh landmarks...' : status === 'success' ? 'Face Verified' : 'Tap to scan Face ID'}
              </div>
            </div>
          )}

          {authMode === 'pin' && (
            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <div className="flex justify-center gap-2">
                <input
                  type="password"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-40 text-center tracking-[0.5em] text-2xl font-bold py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[#F27430]"
                />
              </div>
              {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Unlock with PIN
              </button>
            </form>
          )}
        </div>

        {/* Security Specs Footer */}
        <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#FFE566]" /> FIPS 140-3 Hardware Key
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
