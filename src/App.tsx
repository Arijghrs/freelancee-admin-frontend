import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
          <Route path="/invoices" element={<AdminLayout><AdminInvoices /></AdminLayout>} />
          <Route path="/disputes" element={<AdminLayout><AdminDisputes /></AdminLayout>} />
          <Route path="/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
          <Route path="/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
          <Route path="/security" element={<AdminLayout><AdminSecurity /></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
