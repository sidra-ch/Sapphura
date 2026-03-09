import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  message?: string
}

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  )
}

/**
 * Error response
 */
export function errorResponse(
  error: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      errors
    },
    { status }
  )
}

/**
 * Validation error response
 */
export function validationError(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors
    },
    { status: 400 }
  )
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(
  message = 'Unauthorized'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 401 }
  )
}

/**
 * Forbidden response
 */
export function forbiddenResponse(
  message = 'Forbidden'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 403 }
  )
}

/**
 * Not found response
 */
export function notFoundResponse(
  message = 'Not found'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 404 }
  )
}

/**
 * Rate limit response
 */
export function rateLimitResponse(
  retryAfter?: number
): NextResponse<ApiResponse> {
  const response = NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.'
    },
    { status: 429 }
  )

  if (retryAfter) {
    response.headers.set('Retry-After', String(retryAfter))
  }

  return response
}
