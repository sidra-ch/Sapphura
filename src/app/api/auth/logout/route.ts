import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })

  // Clear the auth token cookie
  response.cookies.delete('auth_token')

  return response
}
