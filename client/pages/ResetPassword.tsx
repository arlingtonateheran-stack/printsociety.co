import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, Loader, Check, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, validatePassword } = useAuth();

  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md">
          <Card className="p-8 shadow-lg text-center">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={32} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Request a new link
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
      setPasswordValidation(validatePassword(value));
    } else {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!newPassword || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!passwordValidation.isValid) {
      setLocalError(passwordValidation.errors[0]);
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to reset password');
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
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2Fdc0d573640c04a0f81b1a11991f519d2?format=webp&width=800&height=1200"
              alt="Print Society Co"
              className="h-16 w-auto mb-2"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Password</h1>
          <p className="text-gray-600 mt-1">Choose a strong password for your account</p>
        </div>

        <Card className="p-8 shadow-lg">
          {submitted ? (
            // Success State
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset</h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Sign In
              </Link>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={handleInputChange}
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

                  {/* Password Requirements */}
                  {newPassword && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
                      <div className="space-y-1">
                        {[
                          {
                            met: newPassword.length >= 8,
                            text: 'At least 8 characters',
                          },
                          {
                            met: /[A-Z]/.test(newPassword),
                            text: 'One uppercase letter',
                          },
                          { met: /\d/.test(newPassword), text: 'One number' },
                          {
                            met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
                            text: 'One special character',
                          },
                        ].map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <Check
                              size={14}
                              className={req.met ? 'text-green-600' : 'text-gray-300'}
                            />
                            <span
                              className={req.met ? 'text-green-700' : 'text-gray-600'}
                            >
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600 mt-2">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-700">
                        Password Strength
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          passwordValidation.strength === 'strong'
                            ? 'text-green-600'
                            : passwordValidation.strength === 'good'
                              ? 'text-blue-600'
                              : passwordValidation.strength === 'fair'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}
                      >
                        {passwordValidation.strength.charAt(0).toUpperCase() +
                          passwordValidation.strength.slice(1)}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition ${
                          passwordValidation.strength === 'strong'
                            ? 'w-full bg-green-600'
                            : passwordValidation.strength === 'good'
                              ? 'w-3/4 bg-blue-600'
                              : passwordValidation.strength === 'fair'
                                ? 'w-1/2 bg-yellow-600'
                                : 'w-1/4 bg-red-600'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader size={18} className="animate-spin" />}
                  {isLoading ? 'Resetting password...' : 'Reset Password'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
