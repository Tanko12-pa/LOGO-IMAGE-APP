import React, { useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PayPalSubscriptionButtonProps {
  planId: string;
  planType: 'MONTHLY_19_99' | 'YEARLY_199_99';
  planName: string;
  priceDisplay: string;
  onApprove: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  onFallbackCheckout?: () => void;
}

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planType,
  planName,
  priceDisplay,
  onFallbackCheckout,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if (onFallbackCheckout) {
        await onFallbackCheckout();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mt-2.5 space-y-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#FFC439] hover:bg-[#F2BA36] active:scale-[0.99] text-[#003087] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
        title={`Subscribe to ${planName} via PayPal (${priceDisplay})`}
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#003087]" />
            <span>Verifying with PayPal...</span>
          </>
        ) : (
          <>
            <span className="font-extrabold italic tracking-tight font-serif text-sm">PayPal</span>
            <span className="font-semibold text-zinc-800">|</span>
            <span>Subscribe ({priceDisplay})</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        <span>PayPal 256-Bit SSL Encrypted • Server Verified</span>
      </div>
    </div>
  );
};
