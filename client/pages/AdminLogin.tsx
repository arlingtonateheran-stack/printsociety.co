import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, Loader, Shield } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loginWithMagicLink, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please enter your email and password');
      return;
    }

    try {
      const response = await login({ email, password, rememberMe });
      // If user doesn't have admin role, redirect them to regular login
      if (response.user?.role !== 'admin') {
        setLocalError('Admin access required. Please contact support.');
        return;
      }
      navigate(response.redirectUrl);
    } catch (err: any) {
      setLocalError(err.message || 'Login failed');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email) {
      setLocalError('Please enter your email');
      return;
    }

    try {
      await loginWithMagicLink(email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send magic link');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-blue-400" size={32} />
            <h1 className="text-3xl font-bold text-white">Admin</h1>
          </div>
          <p className="text-slate-400 mt-1">Sticky Slap Admin Portal</p>
        </div>

        <Card className="p-8 shadow-lg bg-slate-800 border-slate-700">
          {magicLinkSent ? (
            // Magic Link Sent State
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-slate-300 mb-6">
                We've sent a magic link to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Click the link in your email to sign in. The link will expire in 24 hours.
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm"
              >
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {(localError || error) && (
                <div className="p-4 bg-red-900 border border-red-700 rounded-lg mb-6">
                  <p className="text-sm text-red-200">{localError || error?.message}</p>
                </div>
              )}

              {/* Login Tabs */}
              <div className="flex gap-4 mb-6 border-b border-slate-700">
                <button
                  onClick={() => setUseMagicLink(false)}
                  className={`pb-3 px-2 font-medium text-sm transition ${
                    !useMagicLink
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setUseMagicLink(true)}
                  className={`pb-3 px-2 font-medium text-sm transition ${
                    useMagicLink
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {!useMagicLink ? (
                // Password Login Form
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-700"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-slate-400">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader size={18} className="animate-spin" />}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                // Magic Link Form
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-400">
                    We'll send you a secure link to sign in instantly, no password needed.
                  </p>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader size={18} className="animate-spin" />}
                    {isLoading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </form>
              )}

              {/* Back to Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Not an admin?{' '}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Customer login
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Admin Portal - Restricted Access
        </p>
      </div>
    </div>
  );
}
