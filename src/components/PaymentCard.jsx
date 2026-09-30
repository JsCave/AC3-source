import React from 'react';
import { CreditCard, RefreshCw, CheckCircle2, AlertCircle, Clock, Banknote } from 'lucide-react';

export function PaymentCard({ DStatus }) {
  // Safe Number Parsing with Fallbacks
  const itemPrice = Number(DStatus?.price) || 1250.00;
  const shippingFees = Number(DStatus?.shippingFees) || 50.00;
  const subtotal = Number(DStatus?.subtotal) || (itemPrice + shippingFees);
  const taxes = Number(DStatus?.taxes) || 182.00;
  const promotions = Number(DStatus?.promotions) || Number(DStatus?.discount) || 0;
  const total = Number(DStatus?.total) || (subtotal + taxes - promotions);

  // Dynamic Day Offset (Defaulting to 3 days if not provided)
  const orderOffsetDays = Number(DStatus?.orderOffsetDays) ?? 3;

  // Method Type Detection
  const rawPaymentMethod = DStatus?.paymentMethod || 'visa';
  const paymentType = rawPaymentMethod.toLowerCase();
  const isCOD = ['cod', 'cash', 'cash on delivery'].includes(paymentType);

  /**
   * BASE DATE CALCULATION:
   * Computes base order time relative to current system date and offset days.
   */
  const getBaseDate = () => {
    const now = new Date();
    if (DStatus?.orderOffsetDays !== undefined && DStatus?.orderOffsetDays !== null) {
      const base = new Date();
      base.setDate(now.getDate() - orderOffsetDays);
      return base;
    }
    if (DStatus?.chargeDate) {
      const parsed = new Date(String(DStatus.chargeDate).replace(' ', 'T'));
      return isNaN(parsed.getTime()) ? now : parsed;
    }
    return now;
  };

  const baseDate = getBaseDate();

  // Helper to format dates dynamically using offset minutes/days
  const formatTxnDate = (referenceDate, minutesOffset = 0) => {
    try {
      let base = new Date(referenceDate);
      if (isNaN(base.getTime())) base = new Date();

      if (minutesOffset !== 0) {
        base.setMinutes(base.getMinutes() + minutesOffset);
      }

      return base.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  // Process Charge Payment History
  const deliveryOffsetMinutes = orderOffsetDays * 1440;
  let defaultHistory = [];
  if (isCOD) {
    defaultHistory = [
      {
        date: formatTxnDate(baseDate, deliveryOffsetMinutes),
        method: 'Cash on Delivery',
        status: DStatus?.DeliverStatus ? 'Completed' : '--',
        purchaseId: DStatus?.purchaseId || 'PUR-98342176',
        amount: total,
        reason: 'Payment pending until courier delivers the package.'
      },
      {
        date: formatTxnDate(baseDate, 0),
        method: 'Cash on Delivery',
        status: '--',
        purchaseId: DStatus?.purchaseId || 'PUR-98342176',
        amount: total,
        reason: 'Payment collected upon delivery'
      },
    ];
  } else {
    defaultHistory = [
      {
        date: formatTxnDate(baseDate, 0),
        method: `${paymentType === 'mastercard' ? 'Mastercard' : 'Visa'} •••• ${DStatus?.cardLast4 || '0000'}`,
        status: DStatus?.chargeStatus || 'Declined',
        purchaseId: DStatus?.purchaseId || 'PUR-98342176',
        amount: total,
        reason: DStatus?.reason || 'transaction over Card limit'
      },
    ];
  }

  const rawHistory = DStatus?.paymentHistory || defaultHistory;
  const paymentHistory = rawHistory.map((txn) => {
    let computedDate = txn.date;

    if (txn.offsetDays !== undefined) {
      computedDate = formatTxnDate(baseDate, Number(txn.offsetDays) * 1440 + Number(txn.offsetMinutes || 0));
    } else if (txn.offsetMinutes !== undefined) {
      computedDate = formatTxnDate(baseDate, Number(txn.offsetMinutes));
    } else if (!computedDate) {
      computedDate = formatTxnDate(baseDate, 0);
    }

    return {
      ...txn,
      date: computedDate,
      amount: Number(txn.amount) || total,
      purchaseId: txn.purchaseId || DStatus?.purchaseId || 'PUR-98342176',
    };
  });

  // Process Dynamic Refund History
  const rawRefundHistory = DStatus?.refundHistory || (DStatus?.hasRefund ? [
    {
      offsetDays: DStatus?.refundOffsetDays ?? 1,
      offsetMinutes: DStatus?.refundOffsetMinutes ?? 0,
      method: isCOD ? 'Cash on Delivery' : `Visa •••• ${DStatus?.cardLast4 || '4242'}`,
      status: 'Refunded',
      refundId: DStatus?.refundId || 'REF-98342176',
      amount: Number(DStatus?.refundAmount) || total,
    }
  ] : []);

  const refundHistory = rawRefundHistory.map((ref) => {
    let computedDate = ref.date;

    if (ref.offsetDays !== undefined) {
      computedDate = formatTxnDate(baseDate, Number(ref.offsetDays) * 1440 + Number(ref.offsetMinutes || 0));
    } else if (ref.offsetMinutes !== undefined) {
      computedDate = formatTxnDate(baseDate, Number(ref.offsetMinutes));
    } else if (!computedDate) {
      computedDate = formatTxnDate(baseDate, (orderOffsetDays + 1) * 1440);
    }

    return {
      ...ref,
      date: computedDate,
      amount: Number(ref.amount) || Number(DStatus?.refundAmount) || total,
      refundId: ref.refundId || DStatus?.refundId || 'REF-98342176',
      method: ref.method || (isCOD ? 'Cash on Delivery' : `Visa •••• ${DStatus?.cardLast4 || '4242'}`),
      status: ref.status || 'Refunded',
    };
  });

  const paymentData = {
    itemName: DStatus?.name || 'Samsung Phone',
    itemPrice,
    shippingFees,
    subtotal,
    taxes,
    promotions,
    total,
    currency: 'EGP',
    hasRefund: Boolean(DStatus?.hasRefund) || refundHistory.length > 0,
    refundAmount: Number(DStatus?.refundAmount) || total,
    cardLast4: DStatus?.cardLast4 || '4242',
    cardExpiry: DStatus?.cardExpiry || '11/27',
  };

  const renderStatusBadge = (status, reason) => {
    const s = String(status || '').toLowerCase();

    if (['completed', 'paid', 'success', 'refunded'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {status}
        </span>
      );
    }

    if (['failed', 'declined', 'rejected'].includes(s)) {
      const errorMsg = reason || 'transaction over Card limit';
      return (
        <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Declined</span>
          </span>
          <span className="text-slate-500 font-medium text-xs break-words">
            – {errorMsg}
          </span>
        </div>
      );
    }

    const pendingMsg = reason || 'payment pending delivery';
    return (
      <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>--</span>
        </span>
        <span className="text-slate-500 font-medium text-xs break-words">
          – {pendingMsg}
        </span>
      </div>
    );
  };

  const renderPaymentBadge = () => {
    switch (paymentType) {
      case 'mastercard':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-slate-900 rounded flex items-center justify-center text-white font-black text-[9px] tracking-tighter shrink-0">
              MC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black">Mastercard ending in {paymentData.cardLast4}</span>
              <span className="text-slate-500 text-[11px]">Expires at {paymentData.cardExpiry}</span>
            </div>
          </div>
        );

      case 'cod':
      case 'cash':
      case 'cash on delivery':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-emerald-600 rounded flex items-center justify-center text-white shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black">Cash on Delivery (COD)</span>
              <span className="text-slate-500 text-[11px]">Pay upon order delivery</span>
            </div>
          </div>
        );

      case 'visa':
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-black rounded flex items-center justify-center text-white font-black tracking-tighter text-[10px] italic shrink-0">
              VISA
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black">Visa ending in {paymentData.cardLast4}</span>
              <span className="text-slate-500 text-[11px]">Expires at {paymentData.cardExpiry}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-xs text-black p-6">
      
      {/* 1. Order Summary Section */}
      <div className="flex flex-col gap-3">
        <span className="font-bold text-black text-sm">Order Summary</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-medium text-black">
            <span className="truncate pr-2">{paymentData.itemName}</span>
            <span className="shrink-0 font-semibold">{paymentData.itemPrice.toFixed(2)} {paymentData.currency}</span>
          </div>
          <div className="flex justify-between items-center text-black">
            <span>Shipping fees</span>
            <span>{paymentData.shippingFees.toFixed(2)} {paymentData.currency}</span>
          </div>
          <div className="flex justify-between items-center text-black">
            <span>Subtotal</span>
            <span>{paymentData.subtotal.toFixed(2)} {paymentData.currency}</span>
          </div>
          <div className="flex justify-between items-center text-black pb-1">
            <span>Taxes (VAT)</span>
            <span>{paymentData.taxes.toFixed(2)} {paymentData.currency}</span>
          </div>
          {paymentData.promotions > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-semibold">
              <span>Promotions / Discount</span>
              <span>-{paymentData.promotions.toFixed(2)} {paymentData.currency}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold text-black text-sm pt-2 border-t border-slate-100">
            <span>Total</span>
            <span>{paymentData.total.toFixed(2)} {paymentData.currency}</span>
          </div>
        </div>
      </div>

      {/* 2. Refund Summary Section (Conditional) */}
      {paymentData.hasRefund && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-1.5 font-bold text-black">
            <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
            <span>Refund Summary</span>
          </div>
          <div className="flex justify-between items-center font-medium text-black">
            <span>Refunded amount</span>
            <span className="font-bold text-emerald-700">-{paymentData.refundAmount.toFixed(2)} {paymentData.currency}</span>
          </div>
        </div>
      )}

      {/* 3. Payment Method Section */}
      <div className="flex flex-col gap-3">
        <span className="font-bold text-black text-sm">Payment Method</span>
        {renderPaymentBadge()}
      </div>

      {/* 4. Transaction Details Table */}
      <div className="flex flex-col gap-3 pt-2">
        <span className="font-bold text-slate-800 text-sm">Transaction Details</span>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Charge Date</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Charge Status</th>
                <th className="p-3">Purchase ID</th>
                <th className="p-3 text-right">Total ({paymentData.currency})</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((txn, idx) => (
                <tr key={idx} className="text-slate-600 font-medium border-b border-slate-100 last:border-0 align-top">
                  <td className="p-3 whitespace-nowrap">{txn.date}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {isCOD ? (
                        <Banknote className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span>{txn.method}</span>
                    </div>
                  </td>
                  <td className="p-3">{renderStatusBadge(txn.status, txn.reason)}</td>
                  <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{txn.purchaseId}</td>
                  <td className="p-3 text-right font-bold text-slate-800 whitespace-nowrap">
                    {txn.amount.toFixed(2)} {paymentData.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Refund Transaction Table (Conditional & Dynamic) */}
      {paymentData.hasRefund && refundHistory.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <span className="font-bold text-slate-800 text-sm">Refund Details</span>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3">Refund Date</th>
                  <th className="p-3">Refund Method</th>
                  <th className="p-3">Refund Status</th>
                  <th className="p-3">Refund ID</th>
                  <th className="p-3 text-right">Refunded ({paymentData.currency})</th>
                </tr>
              </thead>
              <tbody>
                {refundHistory.map((ref, idx) => (
                  <tr key={idx} className="text-slate-600 font-medium border-b border-slate-100 last:border-0 align-top">
                    <td className="p-3 whitespace-nowrap">{ref.date}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{ref.method}</span>
                      </div>
                    </td>
                    <td className="p-3">{renderStatusBadge(ref.status)}</td>
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{ref.refundId}</td>
                    <td className="p-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                      -{ref.amount.toFixed(2)} {paymentData.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}