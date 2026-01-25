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
          <p className="text-slate-400 mt-1">Print Society .co Admin Portal</p>
        </div>

        <Card className="p-8 shadow-lg bg-slate-800 border-slate-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-yellow-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Login Temporarily Disabled</h2>
            <p className="text-slate-300 mb-6">
              Admin login is currently disabled. Please check back soon.
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Back to Home
            </Link>
          </div>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Admin Portal - Restricted Access
        </p>
      </div>
    </div>
  );
}
