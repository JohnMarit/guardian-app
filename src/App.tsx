import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiProvider } from "@/context/ApiContext";

// Configure React Query with global error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000
    },
    mutations: {
      retry: 1
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ApiProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
