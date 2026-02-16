import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2Fdc0d573640c04a0f81b1a11991f519d2?format=webp&width=800&height=1200"
              alt="Print Society Co"
              className="h-16 w-auto mb-2"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        </div>

        <Card className="p-8 shadow-lg">
          {useMagicLink ? (
            // Magic Link Form
            <div className="space-y-6">
              {magicLinkSent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-green-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a magic login link to <span className="font-semibold">{email}</span>.
                  </p>
                  <button
                    onClick={() => setMagicLinkSent(false)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    ← Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in with Magic Link</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader className="animate-spin" size={18} />}
                    {isLoading ? 'Sending Link...' : 'Send Magic Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseMagicLink(false)}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
                  >
                    Use password instead
                  </button>
                </form>
              )}
            </div>
          ) : (
            // Password Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

              {localError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                  {localError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-sm text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="animate-spin" size={18} />}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUseMagicLink(true)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Magic Login Link
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">Sign up</Link>
              </p>
            </form>
          )}
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-gray-700 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-gray-700 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
