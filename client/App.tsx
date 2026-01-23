import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/proofs" element={<Proofs />} />
            <Route path="/proofs/:proofId" element={<ProofDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/order-lookup" element={<OrderLookup />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/admin/shipping" element={<AdminShipping />} />
            <Route path="/admin/seo" element={<AdminSEO />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/discounts" element={<AdminDiscounts />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
