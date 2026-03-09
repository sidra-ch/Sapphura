'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import CartSummary from '@/components/cart/CartSummary';
import CouponInput from '@/components/cart/CouponInput';
import Loader from '@/components/ui/Loader';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'review' | 'payment';
type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'visa' | 'mastercard';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const isOnlinePayment = paymentMethod !== 'cod';

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-8 opacity-80">Add some items to your cart before checking out.</p>
          <Link href="/collections" className="gold-btn px-8 py-3 rounded-lg font-semibold inline-block">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 3000 ? 0 : 200;
  const total = subtotal + shippingCost;

  const validateShipping = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]+$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State/Province is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'shipping') {
      if (validateShipping()) {
        setCurrentStep('review');
      }
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.zipCode,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          subtotal,
          shipping: shippingCost,
          tax: 0,
          total,
          paymentMethod: paymentMethod.toUpperCase(),
          notes: shippingInfo.notes || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const data = await response.json();
      
      // Clear cart
      clearCart();

      if (isOnlinePayment) {
        router.push(`/payment/${data.order.orderNumber}?method=${paymentMethod}&total=${total}`);
      } else {
        // Redirect COD orders directly to confirmation page
        router.push(`/order-confirmation?orderId=${data.order.orderNumber}&total=${total}`);
      }
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'review', label: 'Review', icon: ShoppingBag },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStepIndex >= index;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isActive
                          ? 'bg-primary text-navy'
                          : 'bg-navy-light text-primary/50 border-2 border-primary/30'
                      } ${isCurrent ? 'scale-110 shadow-lg shadow-primary/50' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? 'text-primary' : 'text-primary/50'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all ${
                        isActive ? 'bg-primary' : 'bg-primary/20'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Shipping Information */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="gold-glass rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Truck className="w-7 h-7 text-primary" />
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-semibold flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                          errors.fullName ? 'border-red-500' : 'border-primary/30'
                        } focus:border-primary outline-none transition-colors`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                            errors.email ? 'border-red-500' : 'border-primary/30'
                          } focus:border-primary outline-none transition-colors`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                            errors.phone ? 'border-red-500' : 'border-primary/30'
                          } focus:border-primary outline-none transition-colors`}
                          placeholder="+92 300 1234567"
                        />
                        <p className="text-xs text-primary/70 mt-1">
                          Order verification and support: +923318807247 (Call/WhatsApp)
                        </p>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                          errors.address ? 'border-red-500' : 'border-primary/30'
                        } focus:border-primary outline-none transition-colors`}
                        placeholder="Nadir Plaza, 5th Road, Commercial Market,Rawalpindi"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold">City *</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                            errors.city ? 'border-red-500' : 'border-primary/30'
                          } focus:border-primary outline-none transition-colors`}
                          placeholder="Rawalpindi"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">State/Province *</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                            errors.state ? 'border-red-500' : 'border-primary/30'
                          } focus:border-primary outline-none transition-colors`}
                          placeholder="Punjab"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${
                            errors.zipCode ? 'border-red-500' : 'border-primary/30'
                          } focus:border-primary outline-none transition-colors`}
                          placeholder="46600"
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-navy-light border border-primary/30 focus:border-primary outline-none transition-colors resize-none"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Review Order */}
              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Shipping Details */}
                  <div className="gold-glass rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <Truck className="w-7 h-7 text-primary" />
                      Shipping Details
                    </h2>
                    <div className="space-y-2 opacity-90">
                      <p><strong>Name:</strong> {shippingInfo.fullName}</p>
                      <p><strong>Email:</strong> {shippingInfo.email}</p>
                      <p><strong>Phone:</strong> {shippingInfo.phone}</p>
                      <p><strong>Address:</strong> {shippingInfo.address}</p>
                      <p><strong>City:</strong> {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      {shippingInfo.notes && (
                        <p><strong>Notes:</strong> {shippingInfo.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="mt-4 text-primary hover:underline text-sm font-semibold"
                    >
                      Edit Shipping Information
                    </button>
                  </div>

                  {/* Order Items */}
                  <div className="gold-glass rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <ShoppingBag className="w-7 h-7 text-primary" />
                      Order Items
                    </h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center pb-4 border-b border-primary/20 last:border-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.name}</h3>
                            <p className="text-sm opacity-70">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Method */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="gold-glass rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-primary" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <label
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">Cash on Delivery</h3>
                          <p className="text-sm opacity-70">
                            Pay with cash when your order is delivered
                          </p>
                        </div>
                        <Truck className="w-8 h-8 text-primary" />
                      </div>
                    </label>

                    {/* EasyPaisa */}
                    <label
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'easypaisa'
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="easypaisa"
                          checked={paymentMethod === 'easypaisa'}
                          onChange={() => setPaymentMethod('easypaisa')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">EasyPaisa</h3>
                          <p className="text-sm opacity-70">
                            Pay instantly via EasyPaisa wallet/account
                          </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-primary" />
                      </div>
                    </label>

                    {/* JazzCash */}
                    <label
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'jazzcash'
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="jazzcash"
                          checked={paymentMethod === 'jazzcash'}
                          onChange={() => setPaymentMethod('jazzcash')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">JazzCash</h3>
                          <p className="text-sm opacity-70">Pay instantly via JazzCash wallet/account</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-primary" />
                      </div>
                    </label>

                    {/* Visa */}
                    <label
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'visa'
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="visa"
                          checked={paymentMethod === 'visa'}
                          onChange={() => setPaymentMethod('visa')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">Visa Card</h3>
                          <p className="text-sm opacity-70">Pay using Visa debit/credit card</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-primary" />
                      </div>
                    </label>

                    {/* MasterCard */}
                    <label
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'mastercard'
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="mastercard"
                          checked={paymentMethod === 'mastercard'}
                          onChange={() => setPaymentMethod('mastercard')}
                          className="w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">MasterCard</h3>
                          <p className="text-sm opacity-70">Pay using MasterCard debit/credit card</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-primary" />
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="mt-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Note:</strong> Please keep exact change ready. Our delivery person will hand over your order after receiving payment.
                      </p>
                    </div>
                  )}

                  {isOnlinePayment && (
                    <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Online Payment:</strong> Next screen par aap ko payment instructions milengi.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              {currentStep !== 'shipping' && (
                <button
                  onClick={() => {
                    if (currentStep === 'review') setCurrentStep('shipping');
                    else if (currentStep === 'payment') setCurrentStep('review');
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-navy-light border border-primary/30 hover:border-primary hover:bg-navy-elevated font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              {currentStep !== 'payment' ? (
                <button
                  onClick={handleNextStep}
                  className="gold-btn flex items-center gap-2 px-8 py-3 rounded-lg font-semibold ml-auto"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="gold-btn flex items-center gap-2 px-8 py-3 rounded-lg font-semibold ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader label="Processing..." />
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gold-glass rounded-2xl p-6 sticky top-28 space-y-6"
            >
              <h3 className="text-xl font-bold">Order Summary</h3>
              
              <CartSummary
                subtotal={subtotal}
                shipping={shippingCost}
                discount={appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0}
                showFreeShippingThreshold={true}
                freeShippingThreshold={3000}
              />

              <CouponInput
                appliedCoupon={appliedCoupon}
                onApply={(code, discount) => setAppliedCoupon({ code, discount })}
                onRemove={() => setAppliedCoupon(null)}
                disabled={isProcessing}
              />

              <div className="space-y-2 text-sm opacity-70">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>7 days easy return</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Customer support 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
