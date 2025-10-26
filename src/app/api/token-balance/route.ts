import { NextRequest, NextResponse } from 'next/server'
import { availService } from '../../../services/availService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const token = searchParams.get('token')

  if (!address || !token) {
    return NextResponse.json({ error: 'Missing address or token parameter' }, { status: 400 })
  }

  try {
    // Validate Avail address format
    if (!address.startsWith('5')) {
      return NextResponse.json({ error: 'Invalid Avail address format' }, { status: 400 })
    }

    let balance = '0.0'

    if (token === 'AVAI') {
      // For AVAIL token, use the native balance
      console.log(`🔍 Fetching AVAIL balance for address: ${address}`)
      
      try {
        const balanceResult = await availService.getBalance(address)
        console.log(`📊 Raw balance result: ${balanceResult}`)
        
        // Extract numeric value from balance string
        // Handle different formats: "1.5 AVAIL", "1,500.5 AVAIL", etc.
        let numericBalance = balanceResult
          .replace(' AVAIL', '') // Remove AVAIL suffix
          .replace(/,/g, '') // Remove commas
          .trim() // Remove whitespace
        
        // Ensure it's a valid number
        const parsedBalance = parseFloat(numericBalance)
        if (isNaN(parsedBalance)) {
          console.warn(`⚠️ Invalid balance format: ${balanceResult}, using 0.0`)
          balance = '0.0'
        } else {
          balance = parsedBalance.toString()
        }
        
        console.log(`✅ Processed balance: ${balance}`)
      } catch (error) {
        console.error(`❌ Error fetching AVAIL balance:`, error)
        balance = '0.0'
      }
    } else {
      // For other tokens (USDC, USDT, etc.), we would need to:
      // 1. Get the token contract address
      // 2. Call the contract's balanceOf function
      // 3. Convert from wei to token units
      
      // For now, return 0 for non-AVAIL tokens since we need token contracts
      balance = '0.0'
    }
    
    return NextResponse.json({
      address,
      token,
      balance,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return NextResponse.json({ error: 'Failed to fetch token balance' }, { status: 500 })
  }
}
