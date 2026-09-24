import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Review, ShopRating } from '../types'

/** 计算店铺平均分：菜品 50% + 服务 50% */
export function calcShopRating(reviews: Pick<Review, 'dish_rating' | 'service_rating'>[]): ShopRating {
  if (reviews.length === 0) {
    return { overall: 0, dish: 0, service: 0, count: 0 }
  }
  let dishSum = 0
  let serviceSum = 0
  for (const r of reviews) {
    dishSum += r.dish_rating
    serviceSum += r.service_rating
  }
  const dish = dishSum / reviews.length
  const service = serviceSum / reviews.length
  const overall = (dish + service) / 2
  return {
    overall: Math.round(overall * 10) / 10,
    dish: Math.round(dish * 10) / 10,
    service: Math.round(service * 10) / 10,
    count: reviews.length,
  }
}

/** 实时订阅店铺平均分（含 events 实时刷新） */
export function useShopRating(): ShopRating {
  const [rating, setRating] = useState<ShopRating>({ overall: 0, dish: 0, service: 0, count: 0 })
  useEffect(() => {
    if (!supabase) return
    const sb = supabase
    let alive = true
    const load = async () => {
      const { data } = await sb
        .from('reviews')
        .select('dish_rating, service_rating')
        .limit(1000)
      if (!alive) return
      setRating(calcShopRating((data as Pick<Review, 'dish_rating' | 'service_rating'>[]) || []))
    }
    load()
    const ch = sb
      .channel('reviews-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => load())
      .subscribe()
    return () => {
      alive = false
      sb.removeChannel(ch)
    }
  }, [])
  return rating
}

/** 提交 / 更新一条评价 */
export async function upsertReview(input: {
  order_id: string
  order_no: string
  items: Review['items']
  dish_rating: number
  service_rating: number
  comment: string
}): Promise<Review | null> {
  if (!supabase) return null
  const now = new Date().toISOString()
  // 先查是否已存在
  const { data: existing } = await supabase
    .from('reviews')
    .select('id, created_at')
    .eq('order_id', input.order_id)
    .maybeSingle()
  if (existing) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        dish_rating: input.dish_rating,
        service_rating: input.service_rating,
        comment: input.comment.trim() || null,
        updated_at: now,
      })
      .eq('id', (existing as { id: string }).id)
      .select('*')
      .single()
    if (error) {
      console.error('update review error', error)
      return null
    }
    return data as Review
  }
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      order_id: input.order_id,
      order_no: input.order_no,
      items: input.items,
      dish_rating: input.dish_rating,
      service_rating: input.service_rating,
      comment: input.comment.trim() || null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()
  if (error) {
    console.error('insert review error', error)
    return null
  }
  return data as Review
}

/** 删除一条评价 */
export async function deleteReview(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) {
    console.error('delete review error', error)
    return false
  }
  return true
}

/** 拉取所有评价（评价板块用，按时间倒序） */
export function useReviews(limit = 200) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!supabase) return
    const sb = supabase
    let alive = true
    const load = async () => {
      const { data } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (!alive) return
      setReviews((data as Review[]) || [])
      setLoading(false)
    }
    load()
    const ch = sb
      .channel('reviews-list-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => load())
      .subscribe()
    return () => {
      alive = false
      sb.removeChannel(ch)
    }
  }, [limit])
  return { reviews, loading }
}

/** 拉取某订单的评价（仅一条） */
export function useReviewByOrderId(orderId: string | null) {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!supabase || !orderId) {
      setReview(null)
      return
    }
    const sb = supabase
    let alive = true
    setLoading(true)
    ;(async () => {
      const { data } = await sb
        .from('reviews')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle()
      if (alive) {
        setReview((data as Review) || null)
        setLoading(false)
      }
    })()
    const ch = sb
      .channel(`review-of-${orderId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews', filter: `order_id=eq.${orderId}` },
        () => {
          sb.from('reviews')
            .select('*')
            .eq('order_id', orderId)
            .maybeSingle()
            .then(({ data }) => alive && setReview((data as Review) || null))
        },
      )
      .subscribe()
    return () => {
      alive = false
      sb.removeChannel(ch)
    }
  }, [orderId])
  return { review, loading }
}
