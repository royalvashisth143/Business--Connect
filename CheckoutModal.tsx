import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  Building,
  Phone,
  FileText
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartSubtotal, createOrder, currentUser, setActiveView } = useApp();

  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [addressLine, setAddressLine] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'Pune');
  const [state, setState] = useState(currentUser?.state || 'Maharashtra');
  const [pincode, setPincode] = useState('411045');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('buyer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);

  if (!isOpen) return null;

  const gstAmount = Math.round(cartSubtotal * 0.12);
  const shippingCharge = cartSubtotal > 2000 ? 0 : 150;
  const grandTotal = cartSubtotal + gstAmount + shippingCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !pincode) {
      alert('Please fill out all required shipping address fields.');
      return;
    }

    setIsProcessing(true);

    // Simulate secure payment processing and verification
    setTimeout(() => {
      const order = createOrder({
        customerUid: currentUser?.uid || 'guest-cust',
        customerName: fullName,
        customerEmail: currentUser?.email || 'buyer@enterprise.in',
        customerPhone: phone,
        shippingAddress: {
          fullName,
          phone,
          addressLine,
          locality: locality || 'Industrial Corridor',
          city,
          state,
          pincode
        },
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.unitPrice * i.quantity,
          businessId: i.product.businessId,
          businessName: i.product.businessName
        })),
        subtotal: cartSubtotal,
        gstAmount,
        shippingCharge,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        orderStatus: 'Confirmed',
      });

      setIsProcessing(false);
      setConfirmedOrder(order);
    }, 1200);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Checkout & GST Invoice
            </span>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              {confirmedOrder ? 'Order Confirmed & GST Tax Invoice' : 'Review & Place Your Order'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {confirmedOrder ? (
            /* ORDER SUCCESS & PRINTABLE GST TAX INVOICE */
            <div className="space-y-6">
              <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="w-14 h-14 rounded-full bg-[#16834A] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0D5F38] dark:text-emerald-300">
                  Payment Verified & Order Confirmed!
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Order ID: <strong className="font-mono text-[#18231D] dark:text-[#F0F4F1]">{confirmedOrder.id}</strong> • Dispatch status notification sent to {confirmedOrder.customerPhone}
                </p>
              </div>

              {/* Printable Invoice Container */}
              <div className="p-6 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] space-y-4 text-xs print:p-0 print:border-none">
                <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div>
                    <div className="font-extrabold text-base text-[#16834A]">BUSINESS CONNECT INDIA</div>
                    <div className="text-[11px] text-gray-500">Official GST Compliant Electronic Invoice</div>
                    <div className="text-[11px] text-gray-500">Invoice No: INV-{confirmedOrder.id}</div>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    <div>Date: {new Date(confirmedOrder.createdAt).toLocaleDateString()}</div>
                    <div>Payment: <strong className="text-emerald-600">{confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})</strong></div>
                  </div>
                </div>

                {/* Billed To / Shipped To */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">Shipping Destination:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {confirmedOrder.shippingAddress.fullName}<br/>
                      {confirmedOrder.shippingAddress.addressLine}, {confirmedOrder.shippingAddress.locality}<br/>
                      {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}<br/>
                      Mobile: {confirmedOrder.shippingAddress.phone}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">Order Status:</div>
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Ready for Dispatch
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Tracking reference will be shared via SMS upon logistics pickup.
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 text-[10px] uppercase">
                      <th className="py-2">Item / Supplier</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {confirmedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2">
                          <div className="font-bold text-gray-800 dark:text-gray-200">{it.productName}</div>
                          <div className="text-[10px] text-gray-500">{it.businessName}</div>
                        </td>
                        <td className="py-2 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 text-right">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2 text-right font-bold">₹{it.subtotal.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 dark:border-gray-700 font-bold">
                      <td colSpan={3} className="pt-2 text-right">Subtotal:</td>
                      <td className="pt-2 text-right">₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right text-gray-500">GST (12% Blended):</td>
                      <td className="text-right text-gray-500">₹{confirmedOrder.gstAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right text-gray-500">Shipping:</td>
                      <td className="text-right text-emerald-600">{confirmedOrder.shippingCharge === 0 ? 'FREE' : `₹${confirmedOrder.shippingCharge}`}</td>
                    </tr>
                    <tr className="text-sm font-extrabold text-[#16834A] border-t border-gray-200 dark:border-gray-700">
                      <td colSpan={3} className="pt-2 text-right">Grand Total Paid:</td>
                      <td className="pt-2 text-right">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveView('dashboard');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  View in My Orders Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              
              {/* Shipping Address */}
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#16834A]" />
                  <span>1. Delivery Destination Address (India)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Full Name / Entity *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit Kulkarni"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 77112"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Shivam Residency, Baner Road"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="411045"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#16834A]" />
                  <span>2. Payment Gateway Method (Indian INR)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A]'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101713] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Instant UPI</span>
                    <span className="text-[10px] text-gray-500 font-normal mt-1">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left flex flex-col justify-between ${
                      paymentMethod === 'Card'
                        ? 'border-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A]'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101713] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Card (Debit/Credit)</span>
                    <span className="text-[10px] text-gray-500 font-normal mt-1">Visa, RuPay, MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left flex flex-col justify-between ${
                      paymentMethod === 'NetBanking'
                        ? 'border-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A]'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101713] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>NetBanking</span>
                    <span className="text-[10px] text-gray-500 font-normal mt-1">SBI, HDFC, ICICI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A]'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101713] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Cash on Delivery</span>
                    <span className="text-[10px] text-gray-500 font-normal mt-1">Pay on Courier Arrival</span>
                  </button>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Enter UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@upi or company@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1]"
                    />
                  </div>
                )}
              </div>

              {/* Order Amount Review Box */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Cart Items ({cart.length}):</span>
                  <span className="font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Applicable GST (12%):</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping:</span>
                  <span className="text-emerald-600 font-bold">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm font-extrabold text-[#18231D] dark:text-[#F0F4F1]">
                  <span>Total Payable:</span>
                  <span className="text-[#16834A] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Verifying Payment with Gateway...</span>
                ) : (
                  <>
                    <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
