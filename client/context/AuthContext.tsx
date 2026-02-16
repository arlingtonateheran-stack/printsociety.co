import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
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
} from "@shared/auth";
import { supabase } from "@/lib/supabase";
import { sendEmail, EMAIL_TEMPLATES } from "@/utils/email";

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
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          const user = session.user;
          const role = user.user_metadata?.role || 'customer';

          const mappedUser: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: role,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at || user.created_at),
            isVerified: !!user.email_confirmed_at,
            isActive: true,
          };

          const mappedSession: AuthSession = {
            id: session.access_token,
            userId: user.id,
            token: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(Date.now() + (session.expires_in || 3600) * 1000),
            createdAt: new Date(),
            lastActive: new Date(),
            ipAddress: "unknown",
            userAgent: navigator.userAgent,
            isActive: true,
          };

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: mappedUser,
            session: mappedSession,
            permissions: ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.customer,
            error: null,
            lastChecked: new Date(),
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false, lastChecked: new Date() }));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState(prev => ({ ...prev, isLoading: false, lastChecked: new Date() }));
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const user = session.user;
        const role = user.user_metadata?.role || 'customer';

        const mappedUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: role,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at || user.created_at),
          isVerified: !!user.email_confirmed_at,
          isActive: true,
        };

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: mappedUser,
          session: {
            id: session.access_token,
            userId: user.id,
            token: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(Date.now() + (session.expires_in || 3600) * 1000),
            createdAt: new Date(),
            lastActive: new Date(),
            ipAddress: "unknown",
            userAgent: navigator.userAgent,
            isActive: true,
          },
          permissions: ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.customer,
          error: null,
          lastChecked: new Date(),
        });
      } else {
        setAuthState({
          ...initialAuthState,
          isLoading: false,
          lastChecked: new Date(),
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const validatePassword = useCallback(
    (password: string): PasswordValidation => {
      const errors: string[] = [];
      let strength: "weak" | "fair" | "good" | "strong" = "weak";

      if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(
          `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`,
        );
      }

      if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
      }

      if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
        errors.push("Password must contain at least one number");
      }

      if (
        PASSWORD_REQUIREMENTS.requireSpecialChar &&
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      ) {
        errors.push("Password must contain at least one special character");
      }

      // Calculate strength
      if (errors.length === 0) {
        if (
          password.length >= 12 &&
          /[A-Z]/.test(password) &&
          /\d/.test(password)
        ) {
          strength = "strong";
        } else if (password.length >= 10) {
          strength = "good";
        } else {
          strength = "fair";
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        strength,
      };
    },
    [],
  );

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;

        if (!data.session) throw new Error("Login failed - no session returned");

        const user = data.session.user;
        const role = user.user_metadata?.role || 'customer';

        const mappedUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: role,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at || user.created_at),
          isVerified: !!user.email_confirmed_at,
          isActive: true,
        };

        const mappedSession: AuthSession = {
          id: data.session.access_token,
          userId: user.id,
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: new Date(Date.now() + (data.session.expires_in || 3600) * 1000),
          createdAt: new Date(),
          lastActive: new Date(),
          ipAddress: "unknown",
          userAgent: navigator.userAgent,
          isActive: true,
        };

        return {
          user: mappedUser,
          session: mappedSession,
          redirectUrl: role === "admin" ? "/admin" : "/account",
        };
      } catch (error: any) {
        const authError: AuthError = {
          code: "invalid_credentials",
          message: error.message || "Invalid email or password",
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
    [],
  );

  const signup = useCallback(
    async (data: SignupFormData): Promise<SignupResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Validate passwords match
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // Validate password strength
        const validation = validatePassword(data.password);
        if (!validation.isValid) {
          throw new Error(validation.errors[0]);
        }

        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
              role: data.signupType === 'wholesale' ? 'customer' : 'customer', // Default to customer, handle wholesale logic if needed
              business_name: data.businessName,
              phone: data.phone,
            },
            emailRedirectTo: `${window.location.origin}/email-verification`
          }
        });

        if (error) throw error;

        if (!authData.user) throw new Error("Signup failed - no user returned");

        const user = authData.user;

        // Send Welcome Email via Resend
        try {
          const template = EMAIL_TEMPLATES.welcome(data.name);
          await sendEmail({
            to: data.email,
            subject: template.subject,
            html: template.html,
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail signup if email fails
        }

        const mappedUser: User = {
          id: user.id,
          email: user.email || '',
          name: data.name,
          role: 'customer',
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at || user.created_at),
          isVerified: !!user.email_confirmed_at,
          isActive: true,
        };

        return {
          user: mappedUser,
          verificationEmailSent: true,
          redirectUrl: "/email-verification?userId=" + user.id,
        };
      } catch (error: any) {
        const authError: AuthError = {
          code: "email_already_exists",
          message: error.message || "Signup failed",
          statusCode: 400,
        };

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }));

        throw authError;
      }
    },
    [validatePassword],
  );

  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setAuthState(initialAuthState);
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const logoutAllSessions = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Call API to invalidate all sessions
      // await api.post('/auth/logout-all-sessions')

      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      setAuthState(initialAuthState);
    } catch (error) {
      console.error("Logout all sessions failed:", error);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      const authError: AuthError = {
        code: "account_not_found",
        message: error.message || "No account found with this email",
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
          throw new Error(validation.errors[0]);
        }

        if (request.newPassword !== request.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.updateUser({
          password: request.newPassword,
        });

        if (error) throw error;

        setAuthState((prev) => ({ ...prev, isLoading: false }));
      } catch (error: any) {
        const authError: AuthError = {
          code: "token_expired",
          message: error.message || "Password reset failed",
          statusCode: 400,
        };

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }));

        throw authError;
      }
    },
    [validatePassword],
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
        code: "token_expired",
        message: "Verification token has expired",
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
        code: "account_not_found",
        message: "Failed to resend verification email",
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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        }
      });

      if (error) throw error;

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      const authError: AuthError = {
        code: "account_not_found",
        message: error.message || "Failed to send magic link",
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
