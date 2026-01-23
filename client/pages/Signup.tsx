import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, Loader, Check } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, validatePassword } = useAuth();

  const [signupType, setSignupType] = useState<'customer' | 'wholesale'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    acceptTerms: false,
    acceptMarketing: false,
    businessType: '',
    businessWebsite: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Validate password in real-time
    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.name || !formData.email) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!formData.acceptTerms) {
      setLocalError('Please accept the Terms of Service');
      return;
    }

    if (!passwordValidation.isValid) {
      setLocalError(passwordValidation.errors[0]);
      return;
    }

    if (signupType === 'wholesale') {
      if (!formData.businessName) {
        setLocalError('Please enter your business name');
        return;
      }
      if (!formData.businessType) {
        setLocalError('Please select your business type');
        return;
      }
      if (!formData.phone) {
        setLocalError('Please enter your phone number');
        return;
      }
    }

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        businessName: formData.businessName,
        phone: formData.phone,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
        signupType,
        businessType: formData.businessType,
        businessWebsite: formData.businessWebsite,
      });

      navigate(response.redirectUrl);
    } catch (err: any) {
      setLocalError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-1">Join Sticky Slap today</p>
        </div>

        <Card className="p-8 shadow-lg">
          {/* Signup Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setSignupType('customer')}
              className={`p-4 rounded-lg border-2 transition ${
                signupType === 'customer'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <User size={24} className="mx-auto mb-2 text-gray-700" />
              <p className="font-medium text-gray-900 text-sm">Customer</p>
              <p className="text-xs text-gray-600">Personal orders</p>
            </button>

            <button
              onClick={() => setSignupType('wholesale')}
              className={`p-4 rounded-lg border-2 transition ${
                signupType === 'wholesale'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Briefcase size={24} className="mx-auto mb-2 text-gray-700" />
              <p className="font-medium text-gray-900 text-sm">Wholesale</p>
              <p className="text-xs text-gray-600">Bulk pricing</p>
            </button>
          </div>

          {/* Error Message */}
          {localError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-700">{localError}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Wholesale Business Name */}
            {signupType === 'wholesale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <Input
                  type="text"
                  name="businessName"
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required={signupType === 'wholesale'}
                />
              </div>
            )}

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number {signupType === 'wholesale' ? '*' : ''}
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                required={signupType === 'wholesale'}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
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
              {formData.password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
                  <div className="space-y-1">
                    {[
                      { met: formData.password.length >= 8, text: 'At least 8 characters' },
                      { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                      { met: /\d/.test(formData.password), text: 'One number' },
                      { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password), text: 'One special character' },
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Check
                          size={14}
                          className={req.met ? 'text-green-600' : 'text-gray-300'}
                        />
                        <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
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
                  value={formData.confirmPassword}
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
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 rounded border-gray-300"
                required
                disabled={isLoading}
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy
                </a>{' '}
                *
              </label>
            </div>

            {/* Marketing Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="acceptMarketing"
                checked={formData.acceptMarketing}
                onChange={handleInputChange}
                className="mt-1 rounded border-gray-300"
                disabled={isLoading}
              />
              <label className="text-sm text-gray-600">
                Send me updates about new products and special offers
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
              className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
            >
              {isLoading && <Loader size={18} className="animate-spin" />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
