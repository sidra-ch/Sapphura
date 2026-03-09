import { createHmac } from 'crypto'

export type OnlinePaymentMethod = 'EASYPAISA' | 'JAZZCASH' | 'VISA' | 'MASTERCARD'

export type PaymentGatewayInfo = {
  method: OnlinePaymentMethod
  label: string
  accountTitle: string
  accountNumber: string
  merchantId: string
}

const defaultGateways: Record<OnlinePaymentMethod, PaymentGatewayInfo> = {
  EASYPAISA: {
    method: 'EASYPAISA',
    label: 'EasyPaisa',
    accountTitle: 'Sappura',
    accountNumber: process.env.EASYPAISA_ACCOUNT_NUMBER || '03XXXXXXXXX',
    merchantId: process.env.EASYPAISA_MERCHANT_ID || 'EP-SANDBOX-001',
  },
  JAZZCASH: {
    method: 'JAZZCASH',
    label: 'JazzCash',
    accountTitle: 'Sappura',
    accountNumber: process.env.JAZZCASH_ACCOUNT_NUMBER || '03XXXXXXXXX',
    merchantId: process.env.JAZZCASH_MERCHANT_ID || 'JC-SANDBOX-001',
  },
  VISA: {
    method: 'VISA',
    label: 'Visa Card',
    accountTitle: 'Sappura',
    accountNumber: process.env.VISA_MERCHANT_ACCOUNT || '4111 **** **** 1111',
    merchantId: process.env.VISA_MERCHANT_ID || 'VISA-SANDBOX-001',
  },
  MASTERCARD: {
    method: 'MASTERCARD',
    label: 'MasterCard',
    accountTitle: 'Sappura',
    accountNumber: process.env.MASTERCARD_MERCHANT_ACCOUNT || '5555 **** **** 4444',
    merchantId: process.env.MASTERCARD_MERCHANT_ID || 'MC-SANDBOX-001',
  },
}

export function isOnlinePaymentMethod(method: string): method is OnlinePaymentMethod {
  return ['EASYPAISA', 'JAZZCASH', 'VISA', 'MASTERCARD'].includes(method)
}

export function getGatewayInfo(method: OnlinePaymentMethod): PaymentGatewayInfo {
  return defaultGateways[method]
}

function getPaymentSecret() {
  return process.env.PAYMENT_SESSION_SECRET || 'dev-payment-session-secret'
}

export function createPaymentToken(input: {
  orderNumber: string
  method: OnlinePaymentMethod
  total: number
  expiresAt: number
}) {
  const payload = `${input.orderNumber}|${input.method}|${input.total}|${input.expiresAt}`
  const signature = createHmac('sha256', getPaymentSecret()).update(payload).digest('hex')
  return `${payload}|${signature}`
}

export function verifyPaymentToken(token: string) {
  const parts = token.split('|')
  if (parts.length !== 5) return { valid: false as const }

  const [orderNumber, method, total, expiresAt, signature] = parts
  if (!isOnlinePaymentMethod(method)) return { valid: false as const }

  const payload = `${orderNumber}|${method}|${total}|${expiresAt}`
  const expected = createHmac('sha256', getPaymentSecret()).update(payload).digest('hex')
  if (expected !== signature) return { valid: false as const }

  if (Date.now() > Number(expiresAt)) return { valid: false as const }

  return {
    valid: true as const,
    orderNumber,
    method,
    total: Number(total),
  }
}
