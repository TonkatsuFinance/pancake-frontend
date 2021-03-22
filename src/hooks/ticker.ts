import { useCallback, useEffect, useRef, useState } from 'react'

// Only support specific token pairs until we find a method to validate token pairs
export enum TokenPair {
  BNBUSDT = 'bnbusdt',
}

/**
 * @see https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams
 */
export interface StreamData {
  e: string
  E: number
  s: string
  p: string
  P: string
  w: string
  x: string
  c: string
  Q: string
  b: string
  B: string
  a: string
  A: string
  o: string
  h: string
  l: string
  v: string
  q: string
  O: number
  C: number
  F: number
  L: number
  n: number
}

export interface TickerStream {
  eventType: string
  eventTime: number
  symbol: string
  priceChange: number
  priceChangePercent: number
  weightAveragePrice: number
  firstTrade: number
  lastPrice: number
  lastQuantity: number
  bestBidPrice: number
  bestBidQuantity: number
  bestAskPrice: number
  bestAskQuantity: number
  openPrice: number
  highPrice: number
  lowPrice: number
  totalTradedBaseAssetVolume: number
  totalTradedQuoteAssetVolume: number
  statisticsOpenTime: number
  statisticsCloseTime: number
  firstTradeId: number
  lastTradeId: number
  totalNumberOfTrades: number
}

export const useTokenPairTicker = (tokenPair: TokenPair, connectOnMount: boolean) => {
  const [stream, setStream] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const websocket = useRef<WebSocket>(null)

  const connect = useCallback(() => {
    websocket.current.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data) as StreamData
        setStream({
          eventType: data.e,
          eventTime: data.E,
          symbol: data.s,
          priceChange: parseFloat(data.p),
          priceChangePercent: parseFloat(data.P),
          weightAveragePrice: parseFloat(data.w),
          firstTrade: parseFloat(data.x),
          lastPrice: parseFloat(data.c),
          lastQuantity: Number(data.Q),
          bestBidPrice: parseFloat(data.b),
          bestBidQuantity: Number(data.B),
          bestAskPrice: parseFloat(data.a),
          bestAskQuantity: Number(data.A),
          openPrice: parseFloat(data.o),
          highPrice: parseFloat(data.h),
          lowPrice: parseFloat(data.l),
          totalTradedBaseAssetVolume: Number(data.v),
          totalTradedQuoteAssetVolume: Number(data.q),
          statisticsOpenTime: Number(data.O),
          statisticsCloseTime: Number(data.C),
          firstTradeId: Number(data.F),
          lastTradeId: Number(data.L),
          totalNumberOfTrades: Number(data.n),
        })
      } catch (error) {
        console.error(`Error parsing data from stream`, error)
      }
    }
  }, [websocket, setStream])

  const disconnect = useCallback(() => {
    websocket.current.close()
  }, [websocket])

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/streams/${tokenPair}@ticker`)

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    websocket.current = ws

    if (connectOnMount) {
      connect()
    }

    return () => {
      ws.close()
    }
  }, [tokenPair, websocket, connect, connectOnMount, setIsConnected])

  return { stream, isConnected, connect, disconnect }
}

// Token pair helpers
export const useBnbUsdtTicker = (connectOnMount = true) => {
  return useTokenPairTicker(TokenPair.BNBUSDT, connectOnMount)
}
