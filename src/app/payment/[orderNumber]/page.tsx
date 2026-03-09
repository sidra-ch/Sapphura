'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const methodLabels: Record<string, string> = {
  easypaisa: 'EasyPaisa',
  jazzcash: 'JazzCash',
  visa: 'Visa Card',
  mastercard: 'MasterCard',
  cod: 'Cash on Delivery',
}

export default function PaymentPage() {
  const params = useParams<{ orderNumber: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [transactionRef, setTransactionRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paymentToken, setPaymentToken] = useState('')
  const [gatewayData, setGatewayData] = useState<{
    accountTitle: string
    accountNumber: string
    merchantId: string
    label: string
    total: number
  } | null>(null)

  const orderNumber = params.orderNumber
  const method = (searchParams.get('method') || 'easypaisa').toLowerCase()
  const total = Number(searchParams.get('total') || 0)

  useEffect(() => {
    const initiate = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}/payment/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method }),
        })

        const data = await response.json()
        if (!data.success) {
          toast.error(data.error || 'Failed to initiate payment')
          return
        }

        setPaymentToken(data.payment.paymentToken)
        setGatewayData({
          accountTitle: data.payment.accountTitle,
          accountNumber: data.payment.accountNumber,
          merchantId: data.payment.merchantId,
          label: data.payment.label,
          total: data.payment.total,
        })
      } catch {
        toast.error('Failed to initiate payment')
      } finally {
        setLoading(false)
      }
    }

    if (orderNumber) {
      initiate()
    }
  }, [orderNumber, method])

  const handleMarkPaid = async () => {
    if (!transactionRef.trim()) {
      toast.error('Please enter transaction reference ID')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderNumber}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paid: true,
          transactionRef,
          paymentToken,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        toast.error(data.error || 'Failed to confirm payment')
        return
      }

      toast.success('Payment confirmed successfully')
      router.push(`/order-confirmation?orderId=${orderNumber}&total=${total}`)
    } catch {
      toast.error('Failed to confirm payment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-24">
      <div className="container mx-auto max-w-2xl">
        <div className="gold-glass rounded-2xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Complete Payment</h1>
          </div>

          <p className="text-primary/75 mb-6">
            Order <strong>{orderNumber}</strong> | Method: <strong>{methodLabels[method] || 'Online Payment'}</strong>
          </p>

          {loading ? (
            <div className="rounded-xl border border-primary/25 bg-navy-light/70 p-5 mb-6">
              <p className="text-primary/75 text-sm">Preparing secure payment session...</p>
            </div>
          ) : null}

          <div className="rounded-xl border border-primary/25 bg-navy-light/70 p-5 mb-6 space-y-2">
            <p className="text-primary/85"><strong>Total Amount:</strong> Rs. {(gatewayData?.total ?? total).toLocaleString()}</p>
            <p className="text-primary/75 text-sm">
              Use your selected payment app/card and complete payment, then enter transaction reference below.
            </p>
            {gatewayData && (
              <>
                <p className="text-primary/80 text-sm"><strong>Account Title:</strong> {gatewayData.accountTitle}</p>
                <p className="text-primary/80 text-sm"><strong>Account / Card:</strong> {gatewayData.accountNumber}</p>
                <p className="text-primary/80 text-sm"><strong>Merchant ID:</strong> {gatewayData.merchantId}</p>
              </>
            )}
          </div>

          <label className="block text-sm text-primary/80 mb-2">Transaction Reference ID</label>
          <input
            type="text"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary mb-4"
            placeholder="e.g. TXN123456789"
          />

          <button
            onClick={handleMarkPaid}
            disabled={submitting || loading || !paymentToken}
            className="gold-btn w-full rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {submitting ? 'Confirming...' : 'I Have Paid'}
          </button>

          <div className="mt-5 text-center">
            <Link href="/collections" className="text-primary/75 hover:text-primary transition-colors">
              Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
