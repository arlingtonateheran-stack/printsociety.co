import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Proofs from "./pages/Proofs";
import ProofDetail from "./pages/ProofDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import HelpCenter from "./pages/HelpCenter";
import Support from "./pages/Support";
import OrderLookup from "./pages/OrderLookup";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDiscounts from "./pages/admin/AdminDiscounts";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Quote from "./pages/Quote";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Accessibility from "./pages/Accessibility";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/support" element={<Support />} />
              <Route path="/order-lookup" element={<OrderLookup />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/email-verification" element={<EmailVerification />} />

              {/* Protected Customer Routes */}
              <Route
                path="/proofs"
                element={
                  <ProtectedRoute>
                    <Proofs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proofs/:proofId"
                element={
                  <ProtectedRoute>
                    <ProofDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:orderId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminOrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pricing"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPricing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/shipping"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminShipping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/seo"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSEO />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/discounts"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDiscounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tickets"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
