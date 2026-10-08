import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  signUpWithEmail,
  signInWithEmail,
  resetPasswordForEmail,
  signInWithGoogle,
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCleanErrorMessage = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please switch to Sign In.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials and try again.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment or reset your password.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const user = await signUpWithEmail(email, password, name.trim());
        setSuccessMsg('🎉 Account created! 7-Day Free Trial activated with 150 AI credits.');
        setTimeout(() => {
          onSuccess?.(user);
          onClose();
        }, 1200);
      } else if (mode === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        const user = await signInWithEmail(email, password);
        setSuccessMsg('✓ Welcome back! Signing you in...');
        setTimeout(() => {
          onSuccess?.(user);
          onClose();
        }, 1000);
      } else if (mode === 'forgot_password') {
        if (!email.trim()) {
          throw new Error('Please enter your email address to receive reset instructions.');
        }
        await resetPasswordForEmail(email);
        setSuccessMsg('✓ Password reset link sent to your email. Check your inbox.');
      }
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setSuccessMsg('✓ Authenticated with Google!');
        setTimeout(() => {
          onSuccess?.(user);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative flex flex-col">
        {/* Top Gradient Accent Header */}
        <div className="h-2 w-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#800020] via-[#F27430] to-[#FFE566] p-0.5 shadow-md">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FFE566]" />
                </div>
              </div>
              <span className="font-extrabold text-sm font-heading text-white">
                LOGIMAGE<span className="text-[#FFE566]">.AI</span>
              </span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white pt-2">
              {mode === 'signup'
                ? 'Create Your Account'
                : mode === 'signin'
                ? 'Welcome Back'
                : 'Reset Your Password'}
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === 'signup'
                ? 'Sign up with your personal email to activate your 7-Day Free Trial.'
                : mode === 'signin'
                ? 'Sign in with your email account to access your workspace.'
                : 'Enter your email address to receive password recovery instructions.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot_password' && (
          <div className="px-6 pb-2">
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up (7-Day Trial)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* 7-Day Free Trial Badge for Signup */}
        {mode === 'signup' && (
          <div className="mx-6 my-2 p-3 rounded-2xl bg-[#800020]/20 border border-[#800020]/40 flex items-center gap-2.5 text-xs text-[#FFE566]">
            <Clock className="w-4 h-4 text-[#F27430] shrink-0" />
            <div>
              <span className="font-bold block">Includes 7-Day Free Trial & 150 Credits</span>
              <span className="text-[11px] text-zinc-300">
                Full access to Flux.1, Midjourney, Stability AI Ultra & vector engines.
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-3.5">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] focus:ring-1 focus:ring-[#F27430]/30 font-sans"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Personal Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] focus:ring-1 focus:ring-[#F27430]/30 font-sans"
              />
            </div>
          </div>

          {/* Password Field */}
          {mode !== 'forgot_password' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-[#FFE566] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a strong password (6+ chars)' : '••••••••'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] focus:ring-1 focus:ring-[#F27430]/30 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-xs shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'signup' ? (
              <>
                <span>Create Account & Activate 7-Day Trial</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE566]" />
              </>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE566]" />
              </>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </button>

          {/* Back to sign in if in forgot password mode */}
          {mode === 'forgot_password' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-900" />
            </div>
            <span className="relative px-3 bg-zinc-950 text-[10px] font-mono text-zinc-500 uppercase">
              Or Continue With
            </span>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.7 5.6 6.5 10.1 6.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="p-3 bg-zinc-900/40 border-t border-zinc-900 text-center text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
};
