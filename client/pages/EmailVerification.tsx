import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Mail, Loader, Check, AlertCircle } from 'lucide-react';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerificationEmail, isLoading } = useAuth();

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'verifying' | 'success' | 'error'
  >('pending');
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-verify if token is in URL
  useEffect(() => {
    if (token && verificationStatus === 'pending') {
      handleAutoVerify();
    }
  }, [token]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleAutoVerify = async () => {
    if (!token) return;

    setVerificationStatus('verifying');
    try {
      await verifyEmail(token);
      setVerificationStatus('success');
    } catch (err: any) {
      setVerificationStatus('error');
      setError(err.message || 'Verification failed');
    }
  };

  const handleResendEmail = async () => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    try {
      await resendVerificationEmail(userId);
      setResendCooldown(60);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
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
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-1">Confirm your email address to get started</p>
        </div>

        <Card className="p-8 shadow-lg">
          {verificationStatus === 'pending' && (
            // No token - show manual verification
            <div className="text-center">
              <Mail className="mx-auto text-green-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check your email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to your email address. Please click the link to verify your account.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Didn't receive an email?
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Check your spam or junk folder</li>
                  <li>Wait a few minutes and try again</li>
                  <li>Check that you entered the correct email</li>
                </ul>
              </div>

              <button
                onClick={handleResendEmail}
                disabled={isLoading || resendCooldown > 0}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend verification email'}
              </button>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}

          {verificationStatus === 'verifying' && (
            // Verifying state
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <Loader
                  className="animate-spin text-green-600"
                  size={48}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                Verifying email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            // Success state
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email verified!
              </h2>
              <p className="text-gray-600 mb-6">
                Your email address has been successfully verified. You can now access your account.
              </p>

              <Link
                to="/account"
                className="inline-block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {verificationStatus === 'error' && (
            // Error state
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification failed
              </h2>
              <p className="text-red-600 mb-6 text-sm">{error}</p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-6">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  What can you do?
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
                  <li>The link may have expired - request a new one</li>
                  <li>Check that the link is correct</li>
                  <li>Contact support if you continue having issues</li>
                </ul>
              </div>

              <button
                onClick={handleResendEmail}
                disabled={isLoading || resendCooldown > 0}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium mb-3"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend verification email'}
              </button>

              <Link
                to="/login"
                className="block text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Back to login
              </Link>
            </div>
          )}
        </Card>

        {/* Help Section */}
        {verificationStatus === 'pending' && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">
              Why verify your email?
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Secure your account with a real email</li>
              <li>✓ Receive order updates and proofs</li>
              <li>✓ Reset your password if needed</li>
              <li>✓ Get important account notifications</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
