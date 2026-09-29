import { useEffect, useState } from 'react'
import { supabase, type Product } from '@/lib/supabase'
import { STORE_ID } from '@/lib/config'
import { GIFT_PRODUCT_ID } from '@/lib/gift-offer'

let cached: Product | null = null

/** Loads the $0 gift product from the DB (only when `enabled`). */
export function useGiftProduct(enabled = true): Product | null {
  const [gift, setGift] = useState<Product | null>(cached)

  useEffect(() => {
    if (!enabled || cached) return
    let alive = true
    supabase
      .from('products')
      .select('*')
      .eq('store_id', STORE_ID)
      .eq('id', GIFT_PRODUCT_ID)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => {
        if (!alive || !data) return
        cached = data as Product
        setGift(cached)
      })
    return () => { alive = false }
  }, [enabled])

  return gift
}