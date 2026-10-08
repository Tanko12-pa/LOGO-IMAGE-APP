import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, AlertCircle, RefreshCw } from 'lucide-react';

interface PayPalSubscriptionButtonProps {
  planId: string;
  planType: 'MONTHLY_19_99' | 'YEARLY_199_99';
  planName: string;
  priceDisplay: string;
  onApprove: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  onFallbackCheckout?: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planId,
  planName,
  priceDisplay,
  onApprove,
  onError,
  onFallbackCheckout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const containerId = `paypal-button-container-${planId}`;

  useEffect(() => {
    let isCancelled = false;
    let checkInterval: any = null;

    const renderPayPalButton = () => {
      const container = containerRef.current || document.getElementById(containerId);
      if (!container || !window.paypal || !window.paypal.Buttons) {
        return false;
      }

      // Clear previous renders if any to prevent duplicate buttons
      container.innerHTML = '';

      try {
        window.paypal
          .Buttons({
            style: {
              shape: 'rect',
              color: 'gold',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: (_data: any, actions: any) => {
              return actions.subscription.create({
                /* Creates the subscription */
                plan_id: planId,
              });
            },
            onApprove: (data: any, _actions: any) => {
              if (data && data.subscriptionID) {
                onApprove(data.subscriptionID);
              }
            },
            onError: (err: any) => {
              console.error(`[PayPal SDK Error for plan ${planId}]:`, err);
              if (!isCancelled) {
                setHasError(true);
                onError?.(err);
              }
            },
          })
          .render(`#${containerId}`)
          .then(() => {
            if (!isCancelled) {
              setIsRendered(true);
              setIsLoading(false);
            }
          })
          .catch((err: any) => {
            console.warn(`[PayPal Render Catch for plan ${planId}]:`, err);
            if (!isCancelled) {
              setHasError(true);
              setIsLoading(false);
            }
          });

        return true;
      } catch (err) {
        console.warn(`[PayPal Buttons Init Error for plan ${planId}]:`, err);
        if (!isCancelled) {
          setHasError(true);
          setIsLoading(false);
        }
        return false;
      }
    };

    // Try immediately
    if (renderPayPalButton()) {
      return () => {
        isCancelled = true;
      };
    }

    // Otherwise poll for PayPal SDK script ready (up to 8 seconds)
    let elapsed = 0;
    checkInterval = setInterval(() => {
      elapsed += 250;
      if (renderPayPalButton() || elapsed > 8000) {
        clearInterval(checkInterval);
        if (elapsed > 8000 && !isRendered && !isCancelled) {
          setIsLoading(false);
          setHasError(true);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [planId, containerId, onApprove, onError]);

  return (
    <div className="w-full mt-3">
      {/* Official PayPal Button Container matching user snippet ID */}
      <div
        id={containerId}
        ref={containerRef}
        className={`w-full min-h-[44px] transition-opacity duration-200 ${
          isRendered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      />

      {/* Loading State Skeleton */}
      {isLoading && !isRendered && !hasError && (
        <div className="w-full py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center gap-2 text-xs font-mono animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>Loading PayPal Subscribe ({priceDisplay})...</span>
        </div>
      )}

      {/* Fallback Checkout Button if SDK iframe is restricted or offline */}
      {hasError && !isRendered && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onFallbackCheckout}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] shadow-md flex items-center justify-center gap-2 transition-all"
            title={`Subscribe to ${planName} via PayPal`}
          >
            <CreditCard className="w-4 h-4 text-[#003087]" />
            <span>Subscribe with PayPal ({priceDisplay})</span>
          </button>
          <p className="text-[10px] text-zinc-500 text-center font-mono flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500/80" />
            <span>Secure PayPal Subscriptions API Gateway</span>
          </p>
        </div>
      )}
    </div>
  );
};
