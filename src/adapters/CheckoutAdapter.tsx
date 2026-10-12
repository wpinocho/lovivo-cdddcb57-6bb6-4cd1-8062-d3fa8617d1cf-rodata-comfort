import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { callEdge, callEdgeFetch } from "@/lib/edge";
import { STORE_ID } from "@/lib/config";
import { useSettings } from "@/contexts/SettingsContext";
import { useCheckout } from "@/hooks/useCheckout";
import { useOrderItems } from "@/hooks/useOrderItems";
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { pickOrderTotals, patchCachedOrderTotals, parseOrderShippingAddress, type OrderTotals } from "@/lib/order-totals";
import { calculateDiscountAmount, validateDiscount, type Discount } from "@/lib/discount-utils";
import { logger } from "@/lib/logger";
import { trackInitiateCheckout, tracking } from "@/lib/tracking-utils";

/**
 * FORBIDDEN ADAPTER - CheckoutAdapter
 * 
 * Este adaptador expone toda la lógica del checkout de forma controlada.
 * Los componentes de UI solo pueden consumir estos métodos, no modificar la lógica interna.
 */
export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currencyCode,
    shippingCoverage,
    pickupLocations,
    deliveryExpectations
  } = useSettings();
  const {
    hasActiveCheckout,
    isInitialized,
    orderId,
    checkoutToken,
    checkout,
    hasItems,
    updateShippingAddress,
    updateBillingAddress,
    updateDiscountCode,
    updateStates,
    appliedRules,
    backendDiscountAmount,
    lastOrder
  } = useCheckout();
  const { isPaymentLinkOrder } = useCheckoutState();

  // ── Totales del servidor: cuando hay pedido, él es la fuente de verdad ──
  const [serverTotals, setServerTotals] = useState<Partial<OrderTotals> | null>(null);

  /** Reemplaza subtotal/descuento/envío/total con lo que responde checkout-update. */
  const applyServerTotals = (resp: any) => {
    const patch = pickOrderTotals(resp);
    if (Object.keys(patch).length === 0) return;
    setServerTotals(prev => ({ ...(prev || {}), ...patch }));
    patchCachedOrderTotals(patch);
  };

  // Pedido cacheado (carga inicial, checkout-create y updates de items vía checkout:updated)
  const cachedOrder = (lastOrder as any)?.order;
  useEffect(() => {
    if (!cachedOrder) return;
    const patch = pickOrderTotals(cachedOrder);
    if (Object.keys(patch).length > 0) setServerTotals(prev => ({ ...(prev || {}), ...patch }));
  }, [cachedOrder]);
  
  const { 
    orderItems, 
    loading: itemsLoading, 
    updateQuantity: updateOrderQuantity, 
    removeItem: removeOrderItem,
    total: orderTotal,
    totalQuantity: orderTotalQuantity,
    updatingItems,
    isStale,
    revalidating,
    refreshItems,
    shippingAmount: itemsShippingAmount
  } = useOrderItems();

  const [order, setOrder] = useState<any>(null);

  // Contact state
  const [email, setEmail] = useState("");
  const [subscribeNews, setSubscribeNews] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Client data autosave with smart validation
  const clientTimer = useRef<number | null>(null);
  const [clientSaving, setClientSaving] = useState(false);
  
  // Address state
  const [address, setAddress] = useState({
    country: "México",
    postal_code: "",
    state: "",
    city: "",
    line1: "",
    line2: ""
  });

  // Pickup and delivery state
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<any>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [usePickup, setUsePickup] = useState(false);

  // Billing address state
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    first_name: "",
    last_name: "",
    country: "México",
    postal_code: "",
    state: "",
    city: "",
    line1: "",
    line2: ""
  });

  // Keep shipping cost in sync - now from checkout-update response
  const [shippingFromCheckout, setShippingFromCheckout] = useState(0);

  // Discount state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const couponInputRef = useRef<HTMLInputElement | null>(null);

  // Loading states for shipping and total calculations
  const isCalculatingShipping = updateStates.updating_address || updatingItems.size > 0;
  const isCalculatingTotal = updateStates.updating_address || updatingItems.size > 0;

  // Update shipping from order items updates
  useEffect(() => {
    if (typeof itemsShippingAmount === 'number') {
      console.log('Updating shipping from order items:', itemsShippingAmount);
      setShippingFromCheckout(itemsShippingAmount);
    }
  }, [itemsShippingAmount]);
  
  useEffect(() => {
    if (selectedPickupLocation) {
      setShippingCost(0);
      return;
    }
    
    const deliveryMethodCost = selectedDeliveryMethod && selectedDeliveryMethod.hasPrice && selectedDeliveryMethod.price ? parseFloat(selectedDeliveryMethod.price) : 0;
    const validDeliveryMethodCost = isFinite(deliveryMethodCost) ? deliveryMethodCost : 0;
    const totalShippingCost = shippingFromCheckout + validDeliveryMethodCost;
    
    setShippingCost(totalShippingCost);
  }, [selectedPickupLocation, selectedDeliveryMethod, deliveryExpectations, shippingFromCheckout]);

  useEffect(() => {
    // Load order from sessionStorage if available
    try {
      const raw = sessionStorage.getItem('checkout_order');
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  const hasTrackedCheckout = useRef(false);
  const hasAutoCreated = useRef(false);

  // Auto-create checkout when arriving via "Comprar ahora" (no active order but cart has items)
  useEffect(() => {
    if (!isInitialized) return;
    if (hasActiveCheckout) return;
    if (!hasItems) return;
    if (hasAutoCreated.current) return;
    hasAutoCreated.current = true;

    checkout({ currencyCode }).then((order) => {
      try {
        sessionStorage.setItem('checkout_order', JSON.stringify(order));
        sessionStorage.setItem('checkout_order_id', String(order.order_id));
      } catch {}
    }).catch((err) => {
      console.error('Auto-checkout creation failed:', err);
    });
  }, [isInitialized, hasActiveCheckout, hasItems]);

  useEffect(() => {
    // Espera a que el estado de checkout se inicialice
    if (!isInitialized) return;

    // Track InitiateCheckout ANTES de cualquier return
    if (!hasTrackedCheckout.current && orderItems.length > 0 && orderTotal > 0) {
      hasTrackedCheckout.current = true;
      trackInitiateCheckout({
        products: orderItems.map((item: any) => tracking.createTrackingProduct({
          id: item.product_id,
          title: item.product_title || item.product?.title,
          price: item.price || item.unit_price,
          category: 'product',
          variant: item.variant_id ? { id: item.variant_id } : undefined
        })),
        value: orderTotal,
        currency: tracking.getCurrencyFromSettings(currencyCode),
        num_items: orderTotalQuantity
      });
    }

    // Fallback: si tenemos el id en sessionStorage, no redirigir
    try {
      const ssId = sessionStorage.getItem('checkout_order_id');
      if (ssId) return;
    } catch {}
  }, [isInitialized, hasActiveCheckout, navigate, toast, orderItems, orderTotal, currencyCode, orderTotalQuantity]);

  // Email validation
  const isValidEmail = (emailValue: string) => {
    const trimmed = emailValue.trim();
    if (trimmed.length < 5) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) && trimmed.includes('.') && !trimmed.endsWith('.');
  };

  // Phone validation
  // Counts ALL digits (including country code) to handle E.164 format like +525531245632
  // MX = +52 (2 digits) + 10 local = 12 total → valid. Min 7 excludes clearly invalid numbers.
  const isValidPhone = (phoneValue: string) => {
    if (!phoneValue.trim()) return false;
    const digitsOnly = phoneValue.replace(/[^\d]/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  // Normalize phone number
  const normalizePhoneNumber = (phoneValue: string) => {
    if (!isValidPhone(phoneValue)) return null;
    
    if (phoneValue.startsWith('+')) {
      const digits = phoneValue.replace(/\D/g, '');
      const match = phoneValue.match(/^\+(\d+)\s?(.+)$/);
      if (match) {
        const countryCode = match[1];
        const number = match[2].replace(/\D/g, '');
        return `+${countryCode}${number}`;
      }
      return `+${digits}`;
    } else {
      const digits = phoneValue.replace(/\D/g, '');
      return `+52${digits}`;
    }
  };

  // Smart client data saving
  const saveClientData = async (immediate = false) => {
    if (!orderId) return;
    const trimmedEmail = email.trim();
    const normalizedPhone = normalizePhoneNumber(phone);

    const hasValidEmail = trimmedEmail && isValidEmail(trimmedEmail);
    const hasValidPhone = normalizedPhone !== null;

    if (!hasValidEmail && !hasValidPhone) return;

    const customerData: any = {};
    if (hasValidEmail) customerData.email = trimmedEmail;
    if (hasValidPhone) customerData.phone = normalizedPhone;

    if (firstName.trim().length >= 2) customerData.first_name = firstName.trim();
    if (lastName.trim().length >= 2) customerData.last_name = lastName.trim();

    customerData.allow_mkt = Boolean(subscribeNews);
    if (clientTimer.current) window.clearTimeout(clientTimer.current);
    const delay = immediate ? 0 : 600;
    clientTimer.current = window.setTimeout(async () => {
      setClientSaving(true);
      try {
        await callEdge('clients-upsert', {
          store_id: STORE_ID,
          order_id: orderId,
          customer: customerData
        });

        logger.debug('Cliente guardado:', {
          phoneInput: phone,
          hasValidPhone,
          hasValidEmail,
          email: hasValidEmail ? trimmedEmail : 'no válido',
          phone: hasValidPhone ? normalizedPhone : 'no válido',
          customerData
        });
      } catch (err: any) {
        console.error('clients-upsert error', err);
      } finally {
        setClientSaving(false);
      }
    }, delay);
  };

  // Debounced autosave for client data
  useEffect(() => {
    saveClientData();
    return () => {
      if (clientTimer.current) window.clearTimeout(clientTimer.current);
    };
  }, [email, firstName, lastName, phone, orderId]);

  // Reset shipping from checkout when country changes but no state selected
  useEffect(() => {
    if (address.country && !address.state) {
      setShippingFromCheckout(0);
      console.log('Country changed without state, resetting shipping from checkout to 0');
    }
  }, [address.country, address.state]);

  // Auto-update shipping address when minimal fields are available
  useEffect(() => {
    if (!hasActiveCheckout || !orderId) return;
    
    const hasMinimalFields = address.country && address.state && address.postal_code;
    
    if (!hasMinimalFields) return;

    const formattedAddress = {
      country_name: address.country,
      state_name: address.state,
      postal_code: address.postal_code,
      ...(address.city && { city: address.city }),
      ...(address.line1 && { line1: address.line1 }),
      ...(address.line2 && { line2: address.line2 }),
      ...(firstName.trim() && { first_name: firstName.trim() }),
      ...(lastName.trim() && { last_name: lastName.trim() })
    };

    console.log('Shipping address update triggered with:', formattedAddress);
    updateShippingAddress(formattedAddress).then((response: any) => {
      if (response && typeof response.shipping_amount === 'number') {
        console.log('Received shipping_amount from checkout-update:', response.shipping_amount);
        setShippingFromCheckout(response.shipping_amount);
      }
      if (response) applyServerTotals(response);
    }).catch(console.error);
  }, [address.country, address.state, address.postal_code, address.city, address.line1, address.line2, firstName, lastName, hasActiveCheckout, orderId, updateShippingAddress]);

  // Auto-update billing address when it changes
  useEffect(() => {
    if (!hasActiveCheckout || !orderId) return;
    
    if (!usePickup && useSameAddress) return;
    
    const minValid = billingAddress.country && billingAddress.postal_code && billingAddress.city && billingAddress.state && billingAddress.line1 && billingAddress.first_name && billingAddress.last_name;
    if (!minValid) return;

    const formattedBillingAddress = {
      first_name: billingAddress.first_name.trim() || undefined,
      last_name: billingAddress.last_name.trim() || undefined,
      line1: billingAddress.line1,
      line2: billingAddress.line2 || undefined,
      city: billingAddress.city,
      state: billingAddress.state,
      postal_code: billingAddress.postal_code,
      country_code: billingAddress.country === 'México' ? 'MX' : billingAddress.country === 'Estados Unidos' ? 'US' : 'MX'
    };

    updateBillingAddress(formattedBillingAddress).catch(console.error);
  }, [billingAddress, useSameAddress, usePickup, hasActiveCheckout, orderId, updateBillingAddress]);

  // Auto-update billing address to null when using same address
  useEffect(() => {
    if (!hasActiveCheckout || !orderId || usePickup) return;
    
    if (useSameAddress) {
      updateBillingAddress(null).catch(console.error);
    }
  }, [useSameAddress, usePickup, hasActiveCheckout, orderId, updateBillingAddress]);

  // Aplicar parámetros de URL (descuentos, contacto, etc.)
  const applyURLParams = (urlParams: any) => {
    if (!urlParams) return;
    
    console.log('📥 Applying URL params:', urlParams);
    
    // Aplicar email
    if (urlParams.email && isValidEmail(urlParams.email)) {
      setEmail(urlParams.email);
      console.log('✅ Email applied from URL:', urlParams.email);
    }
    
    // Aplicar nombres
    if (urlParams.firstName) {
      setFirstName(urlParams.firstName);
      console.log('✅ First name applied from URL:', urlParams.firstName);
    }
    if (urlParams.lastName) {
      setLastName(urlParams.lastName);
      console.log('✅ Last name applied from URL:', urlParams.lastName);
    }
    
    // Aplicar teléfono
    if (urlParams.phone) {
      setPhone(urlParams.phone);
      console.log('✅ Phone applied from URL:', urlParams.phone);
    }
  };

  // Hidratar datos de contacto desde sessionStorage (guardados por useURLCartLoader)
  useEffect(() => {
    if (!hasActiveCheckout) return;

    const keys = ['url_email', 'url_firstName', 'url_lastName', 'url_phone'] as const;
    const stored: Record<string, string> = {};
    for (const k of keys) {
      const v = sessionStorage.getItem(k);
      if (v) { stored[k] = v; sessionStorage.removeItem(k); }
    }
    if (Object.keys(stored).length === 0) return;

    if (stored.url_email && isValidEmail(stored.url_email)) setEmail(stored.url_email);
    if (stored.url_firstName) setFirstName(stored.url_firstName);
    if (stored.url_lastName) setLastName(stored.url_lastName);
    if (stored.url_phone) setPhone(stored.url_phone);

    console.log('📥 Contact data hydrated from sessionStorage:', stored);
  }, [hasActiveCheckout]);

  // Validación diferida de descuento desde sessionStorage
  useEffect(() => {
    const pendingDiscount = sessionStorage.getItem('pendingDiscount');
    
    if (pendingDiscount && !discount && hasActiveCheckout) {
      console.log('🎟️ Found pending discount in sessionStorage:', pendingDiscount);
      
      // Aplicar el código al input
      setCouponCode(pendingDiscount);
      
      // Validar después de un delay para permitir que el componente se monte
      const timer = setTimeout(() => {
        console.log('🔍 Validating pending discount...');
        validateCoupon();
        // Limpiar sessionStorage después de aplicar
        sessionStorage.removeItem('pendingDiscount');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [hasActiveCheckout, discount]);

  // Coupon validation
  const validateCoupon = async () => {
    console.log('validateCoupon called with:', { couponCode: couponCode.trim(), hasActiveCheckout, orderId });
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const json = await callEdgeFetch('verify-discount', {
        store_id: STORE_ID,
        code: couponCode.trim().toUpperCase()
      });
      console.log('verify-discount response:', json);
      if (json.ok) {
        const discountData: Discount = json.data;
        const totalQuantity = summaryItems.reduce((total, item) => total + item.quantity, 0);
        const validation = validateDiscount(discountData, summaryTotal, totalQuantity);
        console.log('Discount validation result:', validation);
        if (validation.valid) {
          console.log('Setting discount and calling updateDiscountCode');
          setDiscount(discountData);
          try {
            const resp = await updateDiscountCode(couponCode.trim().toUpperCase(), true);
            if (resp) applyServerTotals(resp);
            console.log('checkout-update sent for discount_code apply');
          } catch (err) {
            console.error('Failed to update checkout with discount_code:', err);
          }
          toast({
            title: '¡Cupón aplicado!',
            description: `Descuento de ${discountData.discount_type === 'percentage' ? `${discountData.value}%` : `$${discountData.value}`} aplicado`,
            duration: 2000
          });
        } else {
          toast({
            title: 'Cupón no válido',
            description: validation.message,
            variant: 'destructive'
          });
        }
      } else {
        // Map backend error strings to user-friendly messages
        const errorMsg = (json.error || '').toLowerCase();
        let description = 'El cupón no es válido o ha expirado';
        if (errorMsg.includes('exhausted') || errorMsg.includes('limit')) {
          description = 'Este código ya no está disponible';
        } else if (errorMsg.includes('expired')) {
          description = 'Este código ha expirado';
        } else if (errorMsg.includes('minimum amount')) {
          description = 'No cumples con el monto mínimo para usar este código';
        } else if (errorMsg.includes('minimum quantity')) {
          description = 'No cumples con la cantidad mínima de productos';
        } else if (json.error) {
          description = json.error;
        }
        toast({
          title: 'Cupón inválido',
          description,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast({
        title: 'Error',
        description: 'No se pudo validar el cupón. Intenta nuevamente.',
        variant: 'destructive'
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = async () => {
    console.log('removeCoupon called, current state:', { discount, couponCode, hasActiveCheckout, orderId });
    setDiscount(null);
    setCouponCode('');
    setIsValidatingCoupon(false);
    try {
      console.log('Calling updateDiscountCode with null');
      const resp = await updateDiscountCode(null, true);
      if (resp) applyServerTotals(resp);
      console.log('checkout-update sent for discount_code removal');
    } catch (err) {
      console.error('Failed to remove discount_code from checkout:', err);
    }
    toast({
      title: 'Cupón removido',
      description: 'El descuento ha sido removido',
      duration: 2000
    });
    requestAnimationFrame(() => couponInputRef.current?.focus());
    console.log('removeCoupon completed, new state should be:', { discount: null, couponCode: '' });
  };

  const getDiscountDisplayText = (discount: Discount, cartQuantity: number) => {
    if (discount.discount_type === 'percentage') return `${discount.value}%`;
    if (discount.discount_type === 'fixed_amount') return `$${discount.value}`;
    if (discount.discount_type === 'volume' && discount.volume_conditions) {
      try {
        const conditions = JSON.parse(discount.volume_conditions);
        let applicableDiscount = 0;
        for (const condition of conditions.sort((a: any, b: any) => b.quantity - a.quantity)) {
          if (cartQuantity >= condition.quantity) {
            applicableDiscount = condition.discount;
            break;
          }
        }
        return `${applicableDiscount}%`;
      } catch {
        return '0%';
      }
    }
    return '0%';
  };

  // Validation function for checkout fields
  const validateCheckoutFields = () => {
    const missingFields = [];
    
    if (!email.trim() || !isValidEmail(email)) {
      missingFields.push('email válido');
    }
    
    if (!usePickup && (!phone.trim() || !isValidPhone(phone))) {
      missingFields.push('teléfono');
    }
    
    if (usePickup) {
      if (!billingAddress.first_name.trim()) {
        missingFields.push('nombre (facturación)');
      }
      if (!billingAddress.last_name.trim()) {
        missingFields.push('apellido (facturación)');
      }
      if (!billingAddress.country) {
        missingFields.push('país (facturación)');
      }
      if (!billingAddress.state) {
        missingFields.push('estado (facturación)');
      }
      if (!billingAddress.city.trim()) {
        missingFields.push('ciudad (facturación)');
      }
      if (!billingAddress.postal_code.trim()) {
        missingFields.push('código postal (facturación)');
      }
      if (!billingAddress.line1.trim()) {
        missingFields.push('dirección (facturación)');
      }
    } else {
      if (!firstName.trim()) {
        missingFields.push('nombre');
      }
      if (!lastName.trim()) {
        missingFields.push('apellido');
      }
      if (!address.country) {
        missingFields.push('país');
      }
      if (!address.state) {
        missingFields.push('estado');
      }
      if (!address.city.trim()) {
        missingFields.push('ciudad');
      }
      if (!address.postal_code.trim()) {
        missingFields.push('código postal');
      }
      if (!address.line1.trim()) {
        missingFields.push('dirección');
      }
      
      if (deliveryExpectations && deliveryExpectations.length > 0) {
        if (!selectedDeliveryMethod) {
          missingFields.push('método de envío');
        }
      }
    }
    
    if (missingFields.length > 0) {
      toast({
        title: 'Campos requeridos',
        description: `Por favor completa: ${missingFields.join(', ')}`,
        variant: 'destructive',
        duration: 5000
      });
      return false;
    }
    
    return true;
  };

  // Page title (SEO)
  useEffect(() => {
    document.title = 'Checkout - Contacto, Envío y Pago';
  }, []);

  // Available countries and states from shipping coverage
  const availableCountries = shippingCoverage?.countries || [];
  const selectedCountryData = availableCountries.find((country: any) => country.name === address.country);
  const availableStates = selectedCountryData?.states || [];

  // Reset state when country changes
  useEffect(() => {
    if (address.country && selectedCountryData && !availableStates.includes(address.state)) {
      setAddress(prev => ({
        ...prev,
        state: ''
      }));
    }
  }, [address.country, availableStates, selectedCountryData, address.state]);

  // Summary calculations
  const summaryItems = orderItems;
  const totalQuantity = orderTotalQuantity;

  // Hay pedido con totales del servidor → se muestran tal cual (sin recalcular)
  const usesOrderTotals = typeof serverTotals?.total_amount === 'number';
  const summaryTotal = usesOrderTotals && typeof serverTotals?.subtotal === 'number' ? serverTotals.subtotal : orderTotal;
  
  const itemsFingerprint = useMemo(() => 
    summaryItems.map(i => `${i.key}:${i.quantity}`).sort().join('|'), 
    [summaryItems]
  );

  // Cálculo en navegador: SOLO mientras todavía no existe pedido
  const localDiscountAmount = useMemo(() => {
    return discount ? calculateDiscountAmount(orderTotal, discount.discount_type, discount.value, totalQuantity, discount.volume_conditions) : 0;
  }, [discount, orderTotal, totalQuantity]);
  const localComputedDiscount = backendDiscountAmount > 0 ? backendDiscountAmount : localDiscountAmount;

  // Con pedido: descuento (incluye el manual de la tienda), envío y total vienen del servidor
  const discountAmount = usesOrderTotals ? (serverTotals?.discount_amount ?? 0) : localComputedDiscount;
  const effectiveShipping = usesOrderTotals && typeof serverTotals?.shipping_amount === 'number' ? serverTotals.shipping_amount : shippingCost;
  const finalTotal = usesOrderTotals
    ? (serverTotals!.total_amount as number)
    : Math.max(0, orderTotal - localComputedDiscount + shippingCost);

  // Link de pago con descuento manual: la cantidad queda fija
  const quantityLocked = isPaymentLinkOrder && discountAmount > 0;
  const guardedUpdateQuantity = (key: string, qty: number) => {
    if (quantityLocked) return;
    return updateOrderQuantity(key, qty);
  };
  const guardedRemoveItem = (key: string) => {
    if (quantityLocked) return;
    return removeOrderItem(key);
  };

  // ── Prellenar formulario con order.shipping_address ──
  const prefill = useMemo(
    () => parseOrderShippingAddress(cachedOrder?.shipping_address, cachedOrder?.email || cachedOrder?.customer_email),
    [cachedOrder?.shipping_address, cachedOrder?.email, cachedOrder?.customer_email]
  );
  const prefillDoneRef = useRef(false);
  useEffect(() => {
    if (prefillDoneRef.current || !prefill) return;
    prefillDoneRef.current = true;
    if (prefill.first_name) setFirstName(prev => prev || prefill.first_name);
    if (prefill.last_name) setLastName(prev => prev || prefill.last_name);
    if (prefill.phone) setPhone(prev => prev || prefill.phone);
    if (prefill.email && isValidEmail(prefill.email)) setEmail(prev => prev || prefill.email);
    setAddress(prev => ({
      ...prev,
      country: prefill.countryName || prev.country,
      line1: prev.line1 || prefill.line1,
      line2: prev.line2 || prefill.line2,
      city: prev.city || prefill.city,
      state: prev.state || prefill.state,
      postal_code: prev.postal_code || prefill.postal_code,
    }));
  }, [prefill]);

  // Valores por defecto para el AddressElement de Stripe
  const defaultStripeAddress = useMemo(() => prefill ? {
    firstName: prefill.first_name,
    lastName: prefill.last_name,
    name: `${prefill.first_name} ${prefill.last_name}`.trim(),
    phone: prefill.phone,
    address: {
      line1: prefill.line1,
      line2: prefill.line2,
      city: prefill.city,
      state: prefill.state,
      postal_code: prefill.postal_code,
      country: prefill.countryCode,
    },
  } : undefined, [prefill]);

  // Payment enablement rules
  const requiresDeliveryMethod = !selectedPickupLocation && !!(deliveryExpectations && deliveryExpectations.length > 0);
  const canPay = !requiresDeliveryMethod || !!selectedDeliveryMethod;

  return {
    // State
    order,
    email,
    subscribeNews,
    firstName,
    lastName,
    phone,
    clientSaving,
    address,
    selectedPickupLocation,
    selectedDeliveryMethod,
    shippingCost: effectiveShipping,
    usePickup,
    useSameAddress,
    billingAddress,
    shippingFromCheckout: usesOrderTotals ? effectiveShipping : shippingFromCheckout,
    couponCode,
    discount,
    isValidatingCoupon,
    
    // Order data
    orderItems,
    itemsLoading,
    orderTotal,
    orderTotalQuantity,
    updatingItems,
    isStale,
    revalidating,
    
    // Checkout data
    hasActiveCheckout,
    isInitialized,
    orderId,
    checkoutToken,
    
    // Settings
    currencyCode,
    shippingCoverage,
    pickupLocations,
    deliveryExpectations,
    availableCountries,
    availableStates,
    
    // Calculated values
    summaryItems,
    summaryTotal,
    totalQuantity,
    itemsFingerprint,
    discountAmount,
    finalTotal,
    appliedRules,
    backendDiscountAmount,
    isCalculatingShipping,
    isCalculatingTotal,
    canPay,
    requiresDeliveryMethod,
    usesOrderTotals,
    quantityLocked,
    isPaymentLinkOrder,
    defaultStripeAddress,
    prefillEmail: prefill?.email || '',
    
    // Actions
    setEmail,
    setSubscribeNews,
    setFirstName,
    setLastName,
    setPhone,
    setAddress,
    setSelectedPickupLocation,
    setSelectedDeliveryMethod,
    setShippingCost,
    setUsePickup,
    setUseSameAddress,
    setBillingAddress,
    setCouponCode,
    
    // Functions
    saveClientData,
    validateCoupon,
    removeCoupon,
    getDiscountDisplayText,
    validateCheckoutFields,
    updateOrderQuantity: guardedUpdateQuantity,
    removeOrderItem: guardedRemoveItem,
    refreshItems,
    isValidEmail,
    isValidPhone,
    applyURLParams,
    
    // Refs
    couponInputRef,
    
    // Events for additional features
    onPaymentStart: () => {
      console.log('Payment process started - ready for additional features')
    },
    onPaymentSuccess: () => {
      console.log('Payment completed successfully - ready for additional tracking')
    }
  }
}