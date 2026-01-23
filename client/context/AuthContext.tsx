import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  AuthContextValue,
  AuthState,
  User,
  AuthSession,
  AuthError,
  LoginCredentials,
  SignupFormData,
  ResetPasswordRequest,
  PasswordValidation,
  PASSWORD_REQUIREMENTS,
  ROLE_PERMISSIONS,
  LoginResponse,
  SignupResponse,
} from '@shared/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  permissions: null,
  error: null,
  lastChecked: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Validate token with backend
          // For now, simulate successful check
          await new Promise((resolve) => setTimeout(resolve, 500));
          // In production, call API to verify token
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          lastChecked: new Date(),
        }));
      }
    };

    checkAuth();
  }, []);

  const validatePassword = useCallback((password: string): PasswordValidation => {
    const errors: string[] = [];
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(
        `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`
      );
    }

    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (
      PASSWORD_REQUIREMENTS.requireSpecialChar &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      errors.push('Password must contain at least one special character');
    }

    // Calculate strength
    if (errors.length === 0) {
      if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) {
        strength = 'strong';
      } else if (password.length >= 10) {
        strength = 'good';
      } else {
        strength = 'fair';
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // TODO: Replace with actual API call
        // await api.post('/auth/login', credentials)

        // Simulate API response
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: true,
          isActive: true,
        };

        const mockSession: AuthSession = {
          id: 'session-1',
          userId: mockUser.id,
          token: 'mock-token-' + Math.random().toString(36),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          lastActive: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          isActive: true,
        };

        // Store token
        localStorage.setItem('authToken', mockSession.token);
        localStorage.setItem('userId', mockUser.id);

        const permissions = ROLE_PERMISSIONS[mockUser.role];

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: mockUser,
          session: mockSession,
          permissions,
          error: null,
          lastChecked: new Date(),
        });

        return {
          user: mockUser,
          session: mockSession,
          redirectUrl: mockUser.role === 'admin' ? '/admin' : '/account',
        };
      } catch (error) {
        const authError: AuthError = {
          code: 'invalid_credentials',
          message: 'Invalid email or password',
          statusCode: 401,
        };

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }));

        throw authError;
      }
    },
    []
  );

  const signup = useCallback(
    async (data: SignupFormData): Promise<SignupResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Validate passwords match
        if (data.password !== data.confirmPassword) {
          throw {
            code: 'password_mismatch',
            message: 'Passwords do not match',
            statusCode: 400,
          };
        }

        // Validate password strength
        const validation = validatePassword(data.password);
        if (!validation.isValid) {
          throw {
            code: 'weak_password',
            message: validation.errors[0],
            statusCode: 400,
          };
        }

        // TODO: Replace with actual API call
        // await api.post('/auth/signup', data)

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: 'user-' + Math.random().toString(36),
          email: data.email,
          name: data.name,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          isActive: true,
        };

        return {
          user: mockUser,
          verificationEmailSent: true,
          redirectUrl: '/email-verification?userId=' + mockUser.id,
        };
      } catch (error) {
        const authError: AuthError = {
          code: 'email_already_exists',
          message: (error as any).message || 'Signup failed',
          statusCode: (error as any).statusCode || 400,
        };

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }));

        throw authError;
      }
    },
    [validatePassword]
  );

  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Call API to invalidate session
      // await api.post('/auth/logout')

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');

      setAuthState(initialAuthState);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const logoutAllSessions = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Call API to invalidate all sessions
      // await api.post('/auth/logout-all-sessions')

      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');

      setAuthState(initialAuthState);
    } catch (error) {
      console.error('Logout all sessions failed:', error);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Call API
      // await api.post('/auth/forgot-password', { email })

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'account_not_found',
        message: 'No account found with this email',
        statusCode: 404,
      };

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));

      throw authError;
    }
  }, []);

  const resetPassword = useCallback(
    async (request: ResetPasswordRequest) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const validation = validatePassword(request.newPassword);
        if (!validation.isValid) {
          throw {
            code: 'weak_password',
            message: validation.errors[0],
            statusCode: 400,
          };
        }

        if (request.newPassword !== request.confirmPassword) {
          throw {
            code: 'password_mismatch',
            message: 'Passwords do not match',
            statusCode: 400,
          };
        }

        // TODO: Call API
        // await api.post('/auth/reset-password', request)

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setAuthState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        const authError: AuthError = {
          code: 'token_expired',
          message: (error as any).message || 'Password reset failed',
          statusCode: (error as any).statusCode || 400,
        };

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }));

        throw authError;
      }
    },
    [validatePassword]
  );

  const verifyEmail = useCallback(async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Call API
      // await api.post('/auth/verify-email', { token })

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user verified status
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        user: prev.user ? { ...prev.user, isVerified: true } : null,
      }));
    } catch (error) {
      const authError: AuthError = {
        code: 'token_expired',
        message: 'Verification token has expired',
        statusCode: 400,
      };

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));

      throw authError;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      // TODO: Call API with refresh token
      // const response = await api.post('/auth/refresh')

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update session
      setAuthState((prev) => ({
        ...prev,
        session: prev.session
          ? {
              ...prev.session,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              lastActive: new Date(),
            }
          : null,
      }));
    } catch (error) {
      // Session refresh failed, logout user
      logout();
    }
  }, [logout]);

  const resendVerificationEmail = useCallback(async (userId: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Call API
      // await api.post('/auth/resend-verification-email', { userId })

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'account_not_found',
        message: 'Failed to resend verification email',
        statusCode: 400,
      };

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));

      throw authError;
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const loginWithMagicLink = useCallback(async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Call API
      // await api.post('/auth/magic-link', { email })

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'account_not_found',
        message: 'No account found with this email',
        statusCode: 404,
      };

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));

      throw authError;
    }
  }, []);

  const value: AuthContextValue = {
    ...authState,
    login,
    loginWithMagicLink,
    signup,
    logout,
    logoutAllSessions,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshSession,
    resendVerificationEmail,
    validatePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
