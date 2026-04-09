import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, X, ShoppingBag, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CartAppliedRules } from "@/components/ui/CartAppliedRules";
import { useNavigate } from "react-router-dom";
import StripePayment from "@/components/StripePayment";
import { CountryPhoneSelect } from "@/components/CountryPhoneSelect";
import { HeadlessCheckout } from "@/components/headless/HeadlessCheckout";
import { BrandLogoLeft } from "@/components/BrandLogoLeft";
import { useURLCheckoutParams } from "@/hooks/useURLCheckoutParams";
import { useTokenCheckout } from "@/hooks/useTokenCheckout";
import { formatMoney } from "@/lib/money";

/**
 * EDITABLE UI COMPONENT - CheckoutUI
 * 
 * Este componente solo maneja la presentación del checkout.
 * Toda la lógica viene del HeadlessCheckout.
 * 
 * PUEDES MODIFICAR LIBREMENTE:
 * - Colores, temas, estilos
 * - Textos e idioma
 * - Layout y estructura visual
 * - Formularios y campos
 * - Animaciones y efectos
 * - Agregar features visuales
 */

export default function CheckoutUI() {
  const { params, hasParams } = useURLCheckoutParams();
  const { isLoadingToken, tokenError, hasToken } = useTokenCheckout();
  const navigate = useNavigate();
  const { paymentMethods, stripeAccountId, chargeType } = useSettings();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Token checkout: show loading/error while resolving the payment link
  if (isLoadingToken || hasToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          {tokenError ? (
            <>
              <p className="text-lg font-semibold text-destructive">Error al cargar la orden</p>
              <p className="text-sm text-muted-foreground">{tokenError}</p>
            </>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Cargando orden...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <HeadlessCheckout>
      {(logic) => {
        // Aplicar parámetros de URL cuando se monta el componente
        useEffect(() => {
          if (hasParams && params) {
            logic.applyURLParams(params);
          }
        }, [hasParams, params]);

        return (
        <div className="min-h-screen bg-background">
          {/* Minimal checkout header - logo only */}
          <header className="border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <BrandLogoLeft />
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Order Summary - Collapsible */}
            <MobileOrderSummary logic={logic} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formulario de Checkout */}
              <div className="space-y-8 bg-card p-3 sm:p-6 rounded-lg">
                {/* Contact Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Contacto</h2>
                  <div className="space-y-4">
                    <div>
                      <Input 
                        type="email" 
                        value={logic.email} 
                        onChange={e => logic.setEmail(e.target.value)} 
                        onBlur={() => logic.saveClientData(true)} 
                        placeholder="Correo electrónico" 
                        className="w-full" 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="subscribe" 
                        checked={logic.subscribeNews} 
                        onCheckedChange={checked => logic.setSubscribeNews(checked as boolean)} 
                      />
                      <Label htmlFor="subscribe" className="text-sm">
                        Envíame noticias y ofertas por correo
                      </Label>
                    </div>
                  </div>
                </section>

                {/* Pickup Locations */}
                {logic.pickupLocations && logic.pickupLocations.length > 0 && (
                  <section>
                    <div className="flex items-center space-x-3 mb-4">
                      <input 
                        type="checkbox" 
                        id="use-pickup" 
                        checked={logic.usePickup} 
                        onChange={e => {
                          logic.setUsePickup(e.target.checked);
                          if (!e.target.checked) {
                            logic.setSelectedPickupLocation(null);
                            logic.setShippingCost(0);
                            logic.setSelectedDeliveryMethod(null);
                          }
                        }} 
                        className="w-4 h-4" 
                      />
                      <label htmlFor="use-pickup" className="text-sm font-medium">Recoger en tienda</label>
                    </div>
                    
                    {logic.usePickup && (
                      <div className="space-y-3">
                        {Array.isArray(logic.pickupLocations) && logic.pickupLocations.map((location: any, index: number) => {
                          const isExpanded = logic.selectedPickupLocation?.name === location.name;
                          return (
                            <div key={index} className="border rounded-lg">
                              <label className="flex items-start p-4 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="pickup" 
                                  value={index} 
                                  checked={isExpanded} 
                                  onChange={() => {
                                    if (isExpanded) {
                                      logic.setSelectedPickupLocation(null);
                                      logic.setShippingCost(0);
                                      logic.setSelectedDeliveryMethod(null);
                                    } else {
                                      logic.setSelectedPickupLocation(location);
                                      logic.setShippingCost(0);
                                      logic.setSelectedDeliveryMethod(null);
                                    }
                                  }} 
                                  className="w-4 h-4 mt-1 mr-3" 
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{location.name}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {location.line1}{location.line2 && `, ${location.line2}`}, {location.city}, {location.country}
                                  </div>
                                  {!isExpanded && <div className="text-sm text-primary mt-1">Te esperamos</div>}
                                  {isExpanded && (
                                    <>
                                      <div className="text-sm text-muted-foreground mt-1">
                                        {location.city}, {location.state}, {location.country} - {location.postal_code}
                                      </div>
                                      {location.schedule && <div className="text-sm text-muted-foreground">Horario: {location.schedule}</div>}
                                      {location.instructions && <div className="text-sm text-primary mt-1">{location.instructions}</div>}
                                    </>
                                  )}
                                </div>
                                <div className="font-semibold text-green-600">GRATIS</div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                )}

                {/* Delivery Section */}
                {!logic.usePickup && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Entrega</h2>
                    
                    <div className="space-y-4">
                      {/* País/Región */}
                      <div>
                        <Select 
                          value={logic.address.country} 
                          onValueChange={value => {
                            const next = {
                              ...logic.address,
                              country: value
                            };
                            logic.setAddress(next);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="País / Región" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(logic.availableCountries) && logic.availableCountries.length > 0 ? 
                              logic.availableCountries.map((country: any) => (
                                <SelectItem key={country.name} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              )) : (
                                <SelectItem value="México">México</SelectItem>
                              )
                            }
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Nombre y Apellidos */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input 
                            id="firstName" 
                            value={logic.firstName} 
                            onChange={e => logic.setFirstName(e.target.value)} 
                            onBlur={() => logic.saveClientData(true)} 
                            placeholder="Nombre" 
                          />
                        </div>
                        <div>
                          <Input 
                            id="lastName" 
                            value={logic.lastName} 
                            onChange={e => logic.setLastName(e.target.value)} 
                            onBlur={() => logic.saveClientData(true)} 
                            placeholder="Apellidos" 
                          />
                        </div>
                      </div>

                      {/* Dirección */}
                      <div>
                        <Input 
                          id="address" 
                          value={logic.address.line1} 
                          onChange={e => logic.setAddress({
                            ...logic.address,
                            line1: e.target.value
                          })} 
                          placeholder="Dirección" 
                        />
                      </div>

                      {/* Complemento de dirección / Colonia */}
                      <div>
                        <Input 
                          value={logic.address.line2} 
                          onChange={e => logic.setAddress({
                            ...logic.address,
                            line2: e.target.value
                          })} 
                          placeholder="Colonia, apartamento, suite, etc. (opcional)" 
                        />
                      </div>

                      {/* Código postal, Ciudad, Estado */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Input 
                            id="postal" 
                            value={logic.address.postal_code} 
                            onChange={e => logic.setAddress({
                              ...logic.address,
                              postal_code: e.target.value
                            })} 
                            placeholder="Código postal" 
                          />
                        </div>
                        <div>
                          <Input 
                            id="city" 
                            value={logic.address.city} 
                            onChange={e => logic.setAddress({
                              ...logic.address,
                              city: e.target.value
                            })} 
                            placeholder="Ciudad"
                          />
                        </div>
                        <div>
                          <Select 
                            value={logic.address.state} 
                            onValueChange={value => {
                              const next = {
                                ...logic.address,
                                state: value
                              };
                              logic.setAddress(next);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(logic.availableStates) && logic.availableStates.length > 0 ? 
                                logic.availableStates.sort((a: string, b: string) => a.localeCompare(b, 'es')).map((state: string) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                )) : (
                                  <SelectItem value="Ciudad de México">Ciudad de México</SelectItem>
                                )
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Teléfono */}
                      <div>
                        <CountryPhoneSelect 
                          value={logic.phone} 
                          onChange={logic.setPhone} 
                          onBlur={() => logic.saveClientData(true)} 
                          placeholder="55 3121 5386" 
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Métodos de envío */}
                {!logic.usePickup && logic.deliveryExpectations && logic.deliveryExpectations.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold mb-4">Métodos de envío</h3>
                    <div className="space-y-2">
                      {Array.isArray(logic.deliveryExpectations) && logic.deliveryExpectations.map((method: any, index: number) => (
                        <div key={index} className="border rounded-lg">
                          <label className="flex items-center justify-between p-4 cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <input 
                                type="radio" 
                                name="delivery-method" 
                                value={index} 
                                checked={logic.selectedDeliveryMethod?.type === method.type} 
                                onChange={() => {
                                  logic.setSelectedDeliveryMethod(method);
                                  logic.setShippingCost(method.hasPrice && method.price ? parseFloat(method.price) : 0);
                                }} 
                                className="w-4 h-4" 
                              />
                              <div>
                                <div className="font-medium">{method.type}</div>
                                <div className="text-sm text-muted-foreground">
                                  {method.description}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              {method.hasPrice && method.price ? formatMoney(parseFloat(method.price), logic.currencyCode) : 'GRATIS'}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Pago */}
                <section>
                  <h3 className="text-lg font-semibold mb-4">Pago</h3>
                  <StripePayment 
                    amountCents={Math.round(logic.finalTotal * 100)} 
                    currency={logic.currencyCode.toLowerCase()} 
                    description={`Pedido #${logic.orderId ?? 's/n'}`} 
                    metadata={{
                      order_id: logic.orderId ?? '',
                      ...(logic.discount?.code ? { discount_code: logic.discount.code } : {})
                    }} 
                    email={logic.email} 
                    name={`${logic.firstName} ${logic.lastName}`.trim()} 
                    phone={logic.phone} 
                    orderId={logic.orderId}
                    checkoutToken={logic.checkoutToken}
                    onValidationRequired={logic.validateCheckoutFields}
                    expectedTotal={Math.round(logic.finalTotal * 100)}
                    deliveryFee={Math.round((logic.shippingFromCheckout || logic.shippingCost) * 100)}
                    shippingAddress={logic.usePickup ? null : {
                      ...logic.address,
                      first_name: logic.firstName,
                      last_name: logic.lastName
                    }}
                    billingAddress={logic.usePickup ? logic.billingAddress : (logic.useSameAddress ? {
                      ...logic.address,
                      first_name: logic.firstName,
                      last_name: logic.lastName
                    } : logic.billingAddress)}
                    items={logic.orderItems}
                    deliveryExpectations={logic.usePickup ? 
                      [{ type: "pickup", description: "Recoger en tienda" }] : 
                      (logic.selectedDeliveryMethod ? [logic.selectedDeliveryMethod] : [])
                    }
                    pickupLocations={logic.usePickup ? 
                      (logic.selectedPickupLocation ? [logic.selectedPickupLocation] : []) : 
                      []
                    }
                    billingSlot={<BillingCheckboxSection logic={logic} />}
                    paymentMethods={paymentMethods}
                    stripeAccountId={stripeAccountId}
                    chargeType={chargeType}
                  />
                </section>
              </div>

              {/* Resumen del pedido */}
              <div className="hidden md:block md:sticky md:top-8 md:h-fit">
                <div className="bg-muted border-l border-muted-foreground/20 p-6 space-y-4 rounded-lg">
                  {/* Loading and stale data states */}
                  {logic.itemsLoading && logic.summaryItems.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando productos...</p>
                    </div>
                  ) : null}
                  
                  {logic.isStale && logic.summaryItems.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4">
                            {logic.revalidating ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                            ) : (
                              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-yellow-800">
                            {logic.revalidating ? 'Restaurando tu carrito...' : 'Mostrando datos guardados'}
                          </span>
                        </div>
                        {!logic.revalidating && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={logic.refreshItems}
                            className="text-yellow-800 hover:text-yellow-900"
                          >
                            Actualizar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Productos del carrito */}
                  {logic.summaryItems.length === 0 && !logic.itemsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      {/* Empty cart icon */}
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                      
                      {/* Main message */}
                      <h3 className="text-lg font-semibold text-foreground">
                        Tu carrito está vacío
                      </h3>
                      
                      {/* Secondary message */}
                      <p className="text-muted-foreground text-center text-sm">
                        Agrega un producto para iniciar tu compra
                      </p>
                      
                      {/* CTA Button */}
                      <Button 
                        onClick={() => navigate('/')}
                        className="mt-4"
                      >
                        Comenzar a Comprar
                      </Button>
                    </div>
                  ) : (
                    Array.isArray(logic.summaryItems) && logic.summaryItems.map(item => (
                      <div key={item.key} className="flex items-center space-x-4">
                        <div className="relative">
                          <img 
                            src={item.product.images?.[0] || "/placeholder.svg"} 
                            alt={item.product.name} 
                            className="w-16 h-16 object-cover rounded border" 
                          />
                          <span className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          {item.variant && <p className="text-sm text-muted-foreground">{item.variant.name}</p>}
                          {item.selling_plan_id && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                <RefreshCw className="h-2.5 w-2.5 mr-0.5" />
                                Suscripción
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-muted-foreground">Cantidad</span>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-8 h-8 p-0" 
                                disabled={logic.updatingItems.has(item.key)}
                                aria-disabled={logic.updatingItems.has(item.key)}
                                onClick={() => logic.updateOrderQuantity(item.key, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="font-medium">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-8 h-8 p-0" 
                                disabled={logic.updatingItems.has(item.key)}
                                aria-disabled={logic.updatingItems.has(item.key)}
                                onClick={() => logic.updateOrderQuantity(item.key, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">
                          {formatMoney(item.total || (item.price * item.quantity), logic.currencyCode)}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Código de descuento */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Código de descuento</div>
                    {!logic.discount ? (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ingresa tu cupón" 
                          value={logic.couponCode} 
                          onChange={e => logic.setCouponCode(e.target.value.toUpperCase())} 
                          className="text-sm" 
                          ref={logic.couponInputRef} 
                          onKeyDown={(e) => { if (e.key === 'Enter') logic.validateCoupon(); }} 
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={logic.validateCoupon} 
                          disabled={logic.isValidatingCoupon || !logic.couponCode.trim()}
                        >
                          <Tag className="h-4 w-4 mr-1" />
                          {logic.isValidatingCoupon ? '...' : 'Aplicar'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm bg-muted/50 border border-border p-3 rounded-lg">
                        <span className="text-foreground font-medium">
                          Cupón aplicado: {logic.couponCode}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={logic.removeCoupon} 
                          className="text-muted-foreground hover:text-foreground p-1 h-auto"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Totales */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatMoney(logic.summaryTotal, logic.currencyCode)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span className={`${logic.isCalculatingShipping ? 'opacity-50 blur-sm' : ''} transition-all duration-200`}>
                        {logic.selectedPickupLocation ? 'GRATIS (Recoger en tienda)' : 
                         logic.shippingCost > 0 ? formatMoney(logic.shippingCost, logic.currencyCode) : 'GRATIS'}
                      </span>
                    </div>

                    {/* Applied rules (automatic discounts from backend) */}
                    {logic.appliedRules && logic.appliedRules.length > 0 && (
                      <CartAppliedRules
                        appliedRules={logic.appliedRules}
                        formatMoney={(v: number) => formatMoney(v, logic.currencyCode)}
                      />
                    )}

                    {/* Manual discount code */}
                    {logic.discount && logic.backendDiscountAmount === 0 && (
                      <div className="flex justify-between">
                        <span>Descuento ({logic.getDiscountDisplayText(logic.discount, logic.totalQuantity)})</span>
                        <span>- {formatMoney(logic.discountAmount, logic.currencyCode)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline text-lg font-semibold pt-2 border-t">
                      <span>Total</span>
                      <div className={`flex items-baseline gap-1.5 ${logic.isCalculatingTotal ? 'opacity-50 blur-sm' : ''} transition-all duration-200`}>
                        <span className="text-sm text-muted-foreground">{logic.currencyCode.toUpperCase()}</span>
                        <span>{formatMoney(logic.finalTotal, logic.currencyCode)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        )
      }}
    </HeadlessCheckout>
  );
}

/* ─── Mobile Order Summary (collapsible, top of checkout) ─── */
function MobileOrderSummary({ logic }: { logic: any }) {
  const [open, setOpen] = useState(false);

  if (logic.summaryItems.length === 0) return null;

  return (
    <div className="md:hidden mb-6 border rounded-lg bg-muted/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Resumen del pedido ({logic.totalQuantity})
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
        <span className="font-semibold">{formatMoney(logic.finalTotal, logic.currencyCode)}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t">
          {/* Items */}
          {logic.summaryItems.map((item: any) => (
            <div key={item.key} className="flex items-center gap-3 pt-3">
              <div className="relative shrink-0">
                <img
                  src={item.product.images?.[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                {item.variant && <p className="text-xs text-muted-foreground">{item.variant.name}</p>}
              </div>
              <span className="text-sm font-medium">
                {formatMoney(item.total || item.price * item.quantity, logic.currencyCode)}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-1 pt-3 border-t text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMoney(logic.summaryTotal, logic.currencyCode)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>
                {logic.selectedPickupLocation
                  ? "GRATIS"
                  : logic.shippingCost > 0
                  ? formatMoney(logic.shippingCost, logic.currencyCode)
                  : "Pendiente"}
              </span>
            </div>
            {logic.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>- {formatMoney(logic.discountAmount, logic.currencyCode)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1 border-t">
              <span>Total</span>
              <span>{formatMoney(logic.finalTotal, logic.currencyCode)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Billing address as checkbox (Shopify-style) ─── */
function BillingCheckboxSection({ logic }: { logic: any }) {
  return (
    <div className="mt-4 space-y-4">
      {/* Checkbox – only show when NOT pickup (pickup always needs billing) */}
      {!logic.usePickup && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-billing"
            checked={logic.useSameAddress}
            onCheckedChange={(v: boolean) => logic.setUseSameAddress(!!v)}
          />
          <Label htmlFor="same-billing" className="text-sm cursor-pointer">
            Usar la dirección de envío como dirección de facturación
          </Label>
        </div>
      )}

      {/* Billing form – show when pickup OR when checkbox unchecked */}
      {(logic.usePickup || !logic.useSameAddress) && (
        <Card className="mt-3">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={logic.billingAddress.first_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, first_name: e.target.value }))}
                placeholder="Nombre"
              />
              <Input
                value={logic.billingAddress.last_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, last_name: e.target.value }))}
                placeholder="Apellidos"
              />
            </div>
            <Input
              value={logic.billingAddress.line1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, line1: e.target.value }))}
              placeholder="Dirección"
            />
            <Input
              value={logic.billingAddress.line2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, line2: e.target.value }))}
              placeholder="Apartamento, suite, etc. (opcional)"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                value={logic.billingAddress.postal_code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, postal_code: e.target.value }))}
                placeholder="C.P."
              />
              <Input
                value={logic.billingAddress.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => logic.setBillingAddress((prev: any) => ({ ...prev, city: e.target.value }))}
                placeholder="Ciudad"
              />
              <Select
                value={logic.billingAddress.state}
                onValueChange={(value: string) => logic.setBillingAddress((prev: any) => ({ ...prev, state: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const states =
                      logic.billingAddress.country === logic.address.country
                        ? logic.availableStates
                        : logic.availableCountries.find((c: any) => c.name === logic.billingAddress.country)?.states || [];
                    return (
                      Array.isArray(states) &&
                      states.map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))
                    );
                  })()}
                </SelectContent>
              </Select>
            </div>
            <Select
              value={logic.billingAddress.country}
              onValueChange={(value: string) => logic.setBillingAddress((prev: any) => ({ ...prev, country: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(logic.availableCountries) &&
                  logic.availableCountries.map((country: any) => (
                    <SelectItem key={country.name} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
    </div>
  );
}