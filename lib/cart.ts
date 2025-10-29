'use client'

export interface CartItem {
  productId: string
  productName: string
  price: number
  image: string | null
  quantity: number
  isBundle?: boolean
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('travel_tots_cart')
  return cart ? JSON.parse(cart) : []
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  const existingIndex = cart.findIndex(i => i.productId === item.productId)
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }
  
  localStorage.setItem('travel_tots_cart', JSON.stringify(cart))
  return cart
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(i => i.productId !== productId)
  localStorage.setItem('travel_tots_cart', JSON.stringify(cart))
  return cart
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const cart = getCart()
  const item = cart.find(i => i.productId === productId)
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    localStorage.setItem('travel_tots_cart', JSON.stringify(cart))
  }
  
  return cart
}

export function clearCart() {
  localStorage.removeItem('travel_tots_cart')
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

