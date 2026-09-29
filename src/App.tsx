import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { GiftCartSync } from "@/components/GiftCartSync";
import { GIFT_PDP_PATH } from "@/lib/gift-offer";
import { useEffect, lazy, Suspense } from "react";
import { trackPageView } from "@/lib/tracking-utils";
import { useURLCartLoader } from "@/hooks/useURLCartLoader";
import { CartProvider } from "@/contexts/CartContext";
import { CartUIProvider } from "@/components/CartProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { PixelProvider } from "@/contexts/PixelContext";
import { GoogleAdsProvider } from "@/contexts/GoogleAdsContext";
import { PostHogProvider } from "@/contexts/PostHogContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Product = lazy(() => import('./pages/Product'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Cart = lazy(() => import('./pages/Cart'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Bundle = lazy(() => import('./pages/Bundle'));
const MySubscriptions = lazy(() => import('./pages/MySubscriptions'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const AboutRodata = lazy(() => import('./pages/AboutRodata'));
const PendingPayment = lazy(() => import('./pages/PendingPayment'));
const OrderTrack = lazy(() => import('./pages/OrderTrack'));
const DeliveryLanding = lazy(() => import('./pages/DeliveryLanding'));
const WristWrapLanding = lazy(() => import('./pages/WristWrapLanding'));
const GiftLanding = lazy(() => import('./pages/GiftLanding'));

const queryClient = new QueryClient();

// Component to track page views on route changes AND scroll to top
function PageViewTracker() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();
  }, [location.pathname]);
  
  return null;
}

/** Loads cart from URL params (?items=...) on any page */
function URLCartLoader() {
  useURLCartLoader();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <PixelProvider>
        <PostHogProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <GoogleAdsProvider>
                  <CartUIProvider>
                    <PageViewTracker />
                    <URLCartLoader />
                    <GiftCartSync />
                    <Suspense fallback={<div className="min-h-screen" />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/productos/munequeras-rodata" element={<WristWrapLanding />} />
                        <Route path={GIFT_PDP_PATH} element={<GiftLanding />} />
                        {/* The $0 gift product is never sold on its own */}
                        <Route path="/productos/regalo-munequeras-rodata" element={<Navigate to={GIFT_PDP_PATH} replace />} />
                        <Route path="/productos/:slug" element={<Product />} />
                        <Route path="/repartidores" element={<DeliveryLanding />} />
                        <Route path="/paquete/:slug" element={<Bundle />} />
                        <Route path="/carrito" element={<Cart />} />
                        <Route path="/pagar" element={<Checkout />} />
                        <Route path="/gracias" element={<ThankYou />} />
                        <Route path="/gracias/:orderId" element={<ThankYou />} />
                        <Route path="/mis-pedidos" element={<MyOrders />} />
                        <Route path="/mis-suscripciones" element={<MySubscriptions />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
                        <Route path="/aviso-de-privacidad" element={<PrivacyPolicy />} />
                        <Route path="/politica-de-devoluciones" element={<ReturnPolicy />} />
                        <Route path="/politica-de-envios" element={<ShippingPolicy />} />
                        <Route path="/sobre-rodata" element={<AboutRodata />} />
                        <Route path="/pago-pendiente/:orderId" element={<PendingPayment />} />
                        <Route path="/orders/track" element={<OrderTrack />} />
                        <Route path="/orders/track/:token" element={<OrderTrack />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </CartUIProvider>
                  </GoogleAdsProvider>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </PostHogProvider>
      </PixelProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;