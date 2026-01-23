// Authentication & Authorization Types

// ============================================================================
// 1. USER ROLES & PERMISSIONS
// ============================================================================

export type UserRole = 'customer' | 'admin' | 'designer' | 'shipping' | 'support';

export interface RolePermissions {
  canViewOrders: boolean;
  canViewProofs: boolean;
  canManageProofs: boolean;
  canViewAccountDashboard: boolean;
  canAccessAdmin: boolean;
  canManageOrders: boolean;
  canManageProducts: boolean;
  canManagePricing: boolean;
  canManageShipping: boolean;
  canManageCustomers: boolean;
  canManageDiscounts: boolean;
  canManageSEO: boolean;
  canManageTickets: boolean;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  customer: {
    canViewOrders: true,
    canViewProofs: true,
    canManageProofs: false,
    canViewAccountDashboard: true,
    canAccessAdmin: false,
    canManageOrders: false,
    canManageProducts: false,
    canManagePricing: false,
    canManageShipping: false,
    canManageCustomers: false,
    canManageDiscounts: false,
    canManageSEO: false,
    canManageTickets: false,
    canManageStaff: false,
    canViewAnalytics: false,
    canExportData: false,
  },
  designer: {
    canViewOrders: true,
    canViewProofs: true,
    canManageProofs: true,
    canViewAccountDashboard: false,
    canAccessAdmin: true,
    canManageOrders: false,
    canManageProducts: false,
    canManagePricing: false,
    canManageShipping: false,
    canManageCustomers: false,
    canManageDiscounts: false,
    canManageSEO: false,
    canManageTickets: false,
    canManageStaff: false,
    canViewAnalytics: true,
    canExportData: false,
  },
  shipping: {
    canViewOrders: false,
    canViewProofs: false,
    canManageProofs: false,
    canViewAccountDashboard: false,
    canAccessAdmin: true,
    canManageOrders: false,
    canManageProducts: false,
    canManagePricing: false,
    canManageShipping: true,
    canManageCustomers: false,
    canManageDiscounts: false,
    canManageSEO: false,
    canManageTickets: false,
    canManageStaff: false,
    canViewAnalytics: true,
    canExportData: true,
  },
  support: {
    canViewOrders: true,
    canViewProofs: false,
    canManageProofs: false,
    canViewAccountDashboard: false,
    canAccessAdmin: true,
    canManageOrders: false,
    canManageProducts: false,
    canManagePricing: false,
    canManageShipping: false,
    canManageCustomers: false,
    canManageDiscounts: false,
    canManageSEO: false,
    canManageTickets: true,
    canManageStaff: false,
    canViewAnalytics: true,
    canExportData: false,
  },
  admin: {
    canViewOrders: true,
    canViewProofs: true,
    canManageProofs: true,
    canViewAccountDashboard: true,
    canAccessAdmin: true,
    canManageOrders: true,
    canManageProducts: true,
    canManagePricing: true,
    canManageShipping: true,
    canManageCustomers: true,
    canManageDiscounts: true,
    canManageSEO: true,
    canManageTickets: true,
    canManageStaff: true,
    canViewAnalytics: true,
    canExportData: true,
  },
};

// ============================================================================
// 2. USER MODELS
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  isActive: boolean;
  customTags?: string[];
}

export interface CustomerUser extends User {
  role: 'customer';
  businessName?: string;
  phone?: string;
  billingAddress?: CustomerAddress;
  shippingAddresses?: CustomerAddress[];
  lifetimeValue: number;
  totalOrders: number;
  artworkLibrary: string[]; // artwork file IDs
  savedProducts: string[]; // product IDs
  tags: CustomerTag[];
}

export interface AdminUser extends User {
  role: 'admin' | 'designer' | 'shipping' | 'support';
  adminRole: UserRole;
  permissions: string[];
  twoFactorEnabled: boolean;
  allowedIPs?: string[];
  lastLoginIP?: string;
  loginAlerts: boolean;
}

export type CustomerTag = 'wholesale' | 'repeat' | 'vip' | 'new' | 'at-risk' | 'custom';

export interface CustomerAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

// ============================================================================
// 3. AUTHENTICATION SESSION
// ============================================================================

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActive: Date;
  ipAddress: string;
  userAgent: string;
  deviceName?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isActive: boolean;
}

export interface LoginSession {
  userId: string;
  role: UserRole;
  ip: string;
  device?: string;
  lastActive: Date;
  sessionId: string;
}

// ============================================================================
// 4. LOGIN / SIGNUP
// ============================================================================

export type AuthMethod = 'email-password' | 'magic-link' | 'oauth';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface MagicLinkRequest {
  email: string;
  redirect?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  businessName?: string;
  phone?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
  signupType: 'customer' | 'wholesale';
}

export interface LoginResponse {
  user: User;
  session: AuthSession;
  redirectUrl: string;
}

export interface SignupResponse {
  user: User;
  verificationEmailSent: boolean;
  redirectUrl: string;
}

// ============================================================================
// 5. PASSWORD MANAGEMENT
// ============================================================================

export interface ForgotPasswordRequest {
  email: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  ipAddress?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// ============================================================================
// 6. EMAIL VERIFICATION
// ============================================================================

export interface EmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  reason: 'signup' | 'email-change' | 'admin-created';
}

export interface EmailVerificationRequest {
  token: string;
  userId: string;
}

// ============================================================================
// 7. RATE LIMITING
// ============================================================================

export interface RateLimitConfig {
  maxLoginAttempts: number;
  maxSignupAttempts: number;
  maxPasswordResetAttempts: number;
  lockoutDurationMinutes: number;
  enableCaptchaAfterFailures: number;
}

export const DEFAULT_RATE_LIMITS: RateLimitConfig = {
  maxLoginAttempts: 5,
  maxSignupAttempts: 3,
  maxPasswordResetAttempts: 3,
  lockoutDurationMinutes: 15,
  enableCaptchaAfterFailures: 3,
};

export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  timestamp: Date;
  reason?: string; // 'invalid_password', 'account_locked', etc.
}

// ============================================================================
// 8. ADMIN SECURITY
// ============================================================================

export interface AdminSecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: '2fa-authenticator' | '2fa-sms';
  allowedIPs?: string[];
  ipWhitelistEnabled: boolean;
  loginAlertsEnabled: boolean;
  sessionTimeout: number; // minutes
  requireMFAForSensitiveActions: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  code: string;
  backupCode?: string;
}

// ============================================================================
// 9. AUTHENTICATION ERRORS
// ============================================================================

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'account_not_found'
  | 'account_not_verified'
  | 'account_locked'
  | 'invalid_token'
  | 'token_expired'
  | 'password_mismatch'
  | 'weak_password'
  | 'email_already_exists'
  | 'unauthorized'
  | 'forbidden'
  | 'session_expired'
  | 'invalid_2fa_code'
  | 'ip_not_allowed'
  | 'rate_limit_exceeded';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

// ============================================================================
// 10. AUTH CONTEXT
// ============================================================================

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: AuthSession | null;
  permissions: RolePermissions | null;
  error: AuthError | null;
  lastChecked: Date | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  loginWithMagicLink: (email: string) => Promise<void>;
  signup: (data: SignupFormData) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  logoutAllSessions: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  resendVerificationEmail: (userId: string) => Promise<void>;
  validatePassword: (password: string) => PasswordValidation;
  clearError: () => void;
}

// ============================================================================
// 11. BUILDER.IO AUTH STATE
// ============================================================================

export interface BuilderAuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
  permissions: RolePermissions | null;
}

// ============================================================================
// 12. STORED CREDENTIALS
// ============================================================================

export interface StoredAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // timestamp
  userRole: UserRole;
  userId: string;
}
