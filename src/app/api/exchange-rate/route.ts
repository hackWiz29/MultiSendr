import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fromToken = searchParams.get('fromToken')
  const toToken = searchParams.get('toToken')

  if (!fromToken || !toToken) {
    return NextResponse.json({ error: 'Missing fromToken or toToken parameter' }, { status: 400 })
  }

  try {
    // Fetch real exchange rates from CoinGecko API
    const tokenMap: Record<string, string> = {
      'AVAI': 'avail',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'DAI': 'dai',
      'BUSD': 'binance-usd',
      'TUSD': 'true-usd',
      'FRAX': 'frax',
      'LUSD': 'liquity-usd'
    }

    const fromId = tokenMap[fromToken] || 'usd-coin'
    const toId = tokenMap[toToken] || 'usd-coin'

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    const fromPrice = data[fromId]?.usd || 1
    const toPrice = data[toId]?.usd || 1
    
    // Rate calculation: how many toTokens you get for 1 fromToken
    // If fromToken = $2 and toToken = $1, then 1 fromToken = 2 toTokens
    const rate = fromPrice / toPrice

    // Validate rate
    if (!rate || rate <= 0 || !isFinite(rate)) {
      throw new Error('Invalid rate calculated')
    }

    return NextResponse.json({
      fromToken,
      toToken,
      rate,
      fromPrice,
      toPrice,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    
    // Fallback to 1:1 for stablecoins
    return NextResponse.json({
      fromToken,
      toToken,
      rate: 1.0,
      fromPrice: 1.0,
      toPrice: 1.0,
      timestamp: new Date().toISOString(),
      fallback: true
    })
  }
}
