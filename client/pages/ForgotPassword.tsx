import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, Loader } from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send reset email');
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-1">We'll send you a link to reset your password</p>
        </div>

        <Card className="p-8 shadow-lg">
          {submitted ? (
            // Success State
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-gray-900 mb-6">{email}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-blue-900">
                  <strong>Didn't receive an email?</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>Check your spam folder</li>
                  <li>Check that you entered the correct email</li>
                  <li>The link will expire in 30 minutes</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  ← Try another email
                </button>
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-center"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {localError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-sm text-red-700">{localError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
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
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the email address associated with your account. We'll send you a link to reset your password.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader size={18} className="animate-spin" />}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </Card>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Having trouble?</h3>
          <p className="text-xs text-gray-600 mb-3">
            If you don't receive a password reset email within a few minutes, try:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc ml-4">
            <li>Checking your spam or junk folder</li>
            <li>Using a different email if you have multiple accounts</li>
            <li>Contacting our support team</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
