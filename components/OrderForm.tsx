'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, User, MapPin, MessageSquare, Phone, Truck, Home, Calendar } from 'lucide-react'
import { calculateDiscountedPrice } from '@/lib/pricing'

interface CartItem {
  productId: string
  productName: string
  quantity: number
  price: number
  rentalStartDate?: string
  rentalEndDate?: string
  days?: number
}

interface OrderFormProps {
  cart: CartItem[]
  totalPrice: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export default function OrderForm({ cart, totalPrice }: OrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    flightDetails: '',
    specialRequests: '',
  })
  const [countryCode, setCountryCode] = useState('+44') // Default to UK
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  // Delivery coordination state
  const [deliveryType, setDeliveryType] = useState<'ACCOMMODATION' | 'AIRPORT' | 'DUAL'>('ACCOMMODATION')
  const [pricingConfig, setPricingConfig] = useState<any>(null)
  const [calculatedTotal, setCalculatedTotal] = useState(totalPrice)
  const [discountedTotal, setDiscountedTotal] = useState(totalPrice)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [bundleDiscount, setBundleDiscount] = useState(0)
  const [requiresContact, setRequiresContact] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [weeklyPrice, setWeeklyPrice] = useState(0)
  const [extraDaysCharge, setExtraDaysCharge] = useState(0)
  
  // Airport delivery fields
  const [outboundAirport, setOutboundAirport] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [onwardJourney, setOnwardJourney] = useState('')
  const [returnAirport, setReturnAirport] = useState('')
  const [returnArrivalTime, setReturnArrivalTime] = useState('')
  const [returnFlightNumber, setReturnFlightNumber] = useState('')
  const [returnDepartureTime, setReturnDepartureTime] = useState('')
  
  // Accommodation delivery fields
  const [accommodationArrival, setAccommodationArrival] = useState('')
  const [accommodationDeparture, setAccommodationDeparture] = useState('')

  // Spanish airports list
  const spanishAirports = [
    'Alicante (ALC)',
    'Corvera RMU (RMU)',
    'Almería (LEI)',
    'Badajoz (BJZ)',
    'Barcelona (BCN)',
    'Bilbao (BIO)',
    'Castellón (CDT)',
    'Córdoba (ODB)',
    'Fuerteventura (FUE)',
    'Girona (GRO)',
    'Granada (GRX)',
    'Ibiza (IBZ)',
    'Jerez (XRY)',
    'Lanzarote (ACE)',
    'Madrid Barajas (MAD)',
    'Málaga (AGP)',
    'Menorca (MAH)',
    'Murcia (MJV)',
    'Palma de Mallorca (PMI)',
    'Pamplona (PNA)',
    'Reus (REU)',
    'Santiago de Compostela (SCQ)',
    'Santander (SDR)',
    'Seville (SVQ)',
    'Tenerife North (TFN)',
    'Tenerife South (TFS)',
    'Valencia (VLC)',
    'Valladolid (VLL)',
    'Vigo (VGO)',
    'Zaragoza (ZAZ)',
  ]

  // Extract country code from phone number
  useEffect(() => {
    const customerSession = localStorage.getItem('customer_session')
    if (customerSession) {
      try {
        const customer: Customer = JSON.parse(customerSession)
        
        // Validate customer data
        if (!customer || !customer.id) {
          console.error('Invalid customer session data')
          return
        }
        
        console.log('Customer ID:', customer.id)
        setCustomerId(customer.id)
        
        // Pre-populate form with customer data
        setFormData({
          customerName: customer.name || '',
          customerEmail: customer.email || '',
          customerPhone: '', // Will be populated below
          customerAddress: '',
          flightDetails: '',
          specialRequests: '',
        })

        // Extract country code from phone number
        if (customer.phone) {
          // Check if phone starts with country codes
          const phone = customer.phone
          if (phone.startsWith('+44')) {
            setCountryCode('+44')
            setFormData(prev => ({ ...prev, customerPhone: phone.replace(/^\+44/, '').trim() }))
          } else if (phone.startsWith('+353')) {
            setCountryCode('+353')
            setFormData(prev => ({ ...prev, customerPhone: phone.replace(/^\+353/, '').trim() }))
          } else if (phone.startsWith('+34')) {
            setCountryCode('+34')
            setFormData(prev => ({ ...prev, customerPhone: phone.replace(/^\+34/, '').trim() }))
          } else if (phone.startsWith('+')) {
            // Extract first few digits as country code
            const match = phone.match(/^(\+\d{1,3})/)
            if (match) {
              setCountryCode(match[1])
              setFormData(prev => ({ ...prev, customerPhone: phone.replace(match[1], '').trim() }))
            } else {
              setFormData(prev => ({ ...prev, customerPhone: phone }))
            }
          } else {
            setFormData(prev => ({ ...prev, customerPhone: phone }))
          }
        }
      } catch (err) {
        console.error('Error parsing customer session:', err)
      }
    }
  }, [])

  // Fetch pricing config and calculate discount
  useEffect(() => {
    if (cart.length > 0 && cart[0].rentalStartDate && cart[0].rentalEndDate) {
      // First, check which products belong to bundles
      const productIds = cart.map(item => item.productId).filter(Boolean) as string[]
      
      Promise.all([
        fetch('/api/admin/pricing').then(res => res.json()),
        productIds.length > 0 
          ? fetch('/api/products/bundles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productIds }),
            }).then(res => res.json()).catch(() => ({}))
          : Promise.resolve({}),
      ]).then(([config, bundleInfo]) => {
        setPricingConfig(config)
        
        // Enhance cart items with bundle membership info
        const enhancedCart = cart.map(item => ({
          ...item,
          belongsToBundles: productIds.length > 0 && item.productId 
            ? Object.keys(bundleInfo).includes(item.productId) 
            : false,
        }))
        
        const result = calculateDiscountedPrice(
          enhancedCart,
          {
            rentalStartDate: cart[0].rentalStartDate!,
            rentalEndDate: cart[0].rentalEndDate!,
          },
          config,
          deliveryType
        )
        
        setCalculatedTotal(result.subtotal)
        setDiscountedTotal(result.total)
        setDeliveryFee(result.deliveryFee)
        setDiscount(result.discount)
        setBundleDiscount(result.bundleDiscount || 0)
        setRequiresContact(result.requiresContact)
        setContactMessage(result.message || '')
        setWeeklyPrice(result.weeklyPrice)
        setExtraDaysCharge(result.extraDaysCharge)
      })
        .catch(err => console.error('Error fetching pricing config:', err))
    }
  }, [cart, deliveryType])

  // Country codes list with UK and Ireland at the top
  const countryCodes = [
    { code: '+44', country: '🇬🇧 United Kingdom' },
    { code: '+353', country: '🇮🇪 Ireland' },
    { code: '+34', country: '🇪🇸 Spain' },
    { code: '+33', country: '🇫🇷 France' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+39', country: '🇮🇹 Italy' },
    { code: '+31', country: '🇳🇱 Netherlands' },
    { code: '+32', country: '🇧🇪 Belgium' },
    { code: '+41', country: '🇨🇭 Switzerland' },
    { code: '+43', country: '🇦🇹 Austria' },
    { code: '+351', country: '🇵🇹 Portugal' },
    { code: '+45', country: '🇩🇰 Denmark' },
    { code: '+46', country: '🇸🇪 Sweden' },
    { code: '+47', country: '🇳🇴 Norway' },
    { code: '+358', country: '🇫🇮 Finland' },
    { code: '+30', country: '🇬🇷 Greece' },
    { code: '+1', country: '🇺🇸 United States' },
    { code: '+1', country: '🇨🇦 Canada' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+27', country: '🇿🇦 South Africa' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!termsAccepted) {
      setError('You must accept the terms and conditions')
      return
    }

    if (cart.length === 0) {
      setError('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      // Group items by rental dates and create separate orders
      // For simplicity, we'll use the first item's dates for all items
      // In a real scenario, you might want to create multiple orders
      const firstItem = cart[0]
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(customerId ? { customerId } : {}), // Only include customerId if it exists
          ...formData,
          customerPhone: countryCode + formData.customerPhone.trim(),
          rentalStartDate: firstItem.rentalStartDate,
          rentalEndDate: firstItem.rentalEndDate,
          termsAccepted,
          totalPrice: discountedTotal,
          // Delivery coordination fields
          deliveryType,
          outboundAirport,
          arrivalTime,
          onwardJourney,
          returnAirport,
          returnArrivalTime,
          returnFlightNumber,
          returnDepartureTime,
          accommodationArrival,
          accommodationDeparture,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price / item.quantity, // Unit price
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Clear cart
        if (typeof window !== 'undefined') {
          localStorage.removeItem('travel_tots_cart')
        }
        router.push(`/order-confirmation?orderId=${data.orderId}`)
      } else {
        setError(data.error || 'Failed to submit order')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {customerId && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          <p className="flex items-center gap-2">
            <User size={18} />
            <strong>Logged in as {formData.customerName}</strong>
          </p>
          <p className="text-sm mt-1">Your information has been pre-filled. You can edit it if needed.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="label">
          <User size={18} className="inline mr-2" />
          Full Name *
        </label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Email Address *</label>
        <input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">
          <Phone size={18} className="inline mr-2" />
          WhatsApp Phone Number *
        </label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="input flex-shrink-0 w-48"
          >
            {countryCodes.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="input flex-1"
            placeholder="7123456789"
            required
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          For example: 7123456789 (UK without leading 0)
        </p>
      </div>

      <div>
        <label className="label">
          <MapPin size={18} className="inline mr-2" />
          Delivery Address *
        </label>
        <textarea
          value={formData.customerAddress}
          onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
          className="input min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="label">
          <Plane size={18} className="inline mr-2" />
          Flight Details
        </label>
        <input
          type="text"
          value={formData.flightDetails}
          onChange={(e) => setFormData({ ...formData, flightDetails: e.target.value })}
          className="input"
          placeholder="e.g., BA245, Arrival 15:30"
        />
      </div>

      <div>
        <label className="label">
          <MessageSquare size={18} className="inline mr-2" />
          Special Requests
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          className="input min-h-[80px]"
          placeholder="Any special delivery instructions or requirements"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="font-semibold mb-2">Items in this order:</p>
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{item.productName} x{item.quantity}</span>
            <span className="font-medium">{item.price.toFixed(2)} EUR</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 space-y-2">
          {/* Warning banner for 15+ day rentals */}
          {requiresContact && (
            <div className="bg-gradient-to-r from-vacation-coral to-vacation-orange text-white p-4 rounded-lg mb-4 flex items-start gap-3">
              <Calendar className="flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold mb-1">Extended Rental Offer</p>
                <p className="text-sm">{contactMessage}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Weekly Price:</span>
            <span>€{weeklyPrice.toFixed(2)}</span>
          </div>
          {extraDaysCharge > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>Extra Days Charge:</span>
              <span>€{extraDaysCharge.toFixed(2)}</span>
            </div>
          )}
          {bundleDiscount > 0 && !requiresContact && (
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>🎁 Bundle Discount ({pricingConfig?.bundleDiscountPercent || 0}%):</span>
              <span>-€{bundleDiscount.toFixed(2)}</span>
            </div>
          )}
          {discount > 0 && !requiresContact && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}
          {(pricingConfig && deliveryType && calculatedTotal > 0) && (
            <>
              {(() => {
                const minOrder = deliveryType === 'AIRPORT' 
                  ? (pricingConfig.airportMinOrder || 0) 
                  : (pricingConfig.minOrderValue || 0)
                const discountedSubtotal = calculatedTotal - bundleDiscount - discount
                return discountedSubtotal < minOrder && !requiresContact ? (
                  <>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal:</span>
                      <span>€{discountedSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Delivery Fee (to reach minimum €{minOrder.toFixed(2)}):</span>
                      <span className="font-medium">€{deliveryFee.toFixed(2)}</span>
                    </div>
                  </>
                ) : null
              })()}
            </>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{requiresContact ? 'Estimated Total:' : 'Total:'}</span>
            <span className="text-primary-600">
              {requiresContact ? 'Contact us for best price' : `€${discountedTotal.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="label">
          <Truck size={18} className="inline mr-2" />
          Delivery Type *
        </label>
        <select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value as any)}
          className="input"
          required
        >
          <option value="ACCOMMODATION">
            All Items to Accommodation {pricingConfig?.minOrderValue ? `(Min Order Value: €${pricingConfig.minOrderValue.toFixed(2)})` : ''}
          </option>
          <option value="AIRPORT">
            Car Seats to Airport {pricingConfig?.airportMinOrder ? `(Min Order Value: €${pricingConfig.airportMinOrder.toFixed(2)})` : ''}
          </option>
          <option value="DUAL">
            Dual Delivery (Split Orders) {pricingConfig?.minOrderValue ? `(Min Order Value: €${pricingConfig.minOrderValue.toFixed(2)})` : ''}
          </option>
        </select>
      </div>

      {/* Delivery Coordination Fields Based on Type */}
      {deliveryType === 'AIRPORT' && (
        <>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plane size={20} />
              Airport Delivery Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Outbound Airport *</label>
                <select
                  value={outboundAirport}
                  onChange={(e) => setOutboundAirport(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select airport...</option>
                  {spanishAirports.map((airport) => (
                    <option key={airport} value={airport}>
                      {airport}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Expected Arrival Time *</label>
                <input
                  type="text"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 15:30"
                  required
                />
              </div>
              
              <div>
                <label className="label">Onward Journey from Airport *</label>
                <select
                  value={onwardJourney}
                  onChange={(e) => setOnwardJourney(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select...</option>
                  <option value="CAR_HIRE">Car Hire</option>
                  <option value="TAXI">Taxi</option>
                  <option value="PRIVATE_TRANSFER">Private Transfer</option>
                  <option value="FRIEND_FAMILY">Friend/Family Pick-up</option>
                  <option value="AIRPORT_PARKING">Airport Parking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Return Journey */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar size={20} />
              Return Journey
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Return Airport</label>
                <select
                  value={returnAirport}
                  onChange={(e) => setReturnAirport(e.target.value)}
                  className="input"
                >
                  <option value="">Select airport...</option>
                  {spanishAirports.map((airport) => (
                    <option key={airport} value={airport}>
                      {airport}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Expected Arrival Time at Airport</label>
                <input
                  type="text"
                  value={returnArrivalTime}
                  onChange={(e) => setReturnArrivalTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 13:00"
                />
              </div>
              
              <div>
                <label className="label">Return Flight Number</label>
                <input
                  type="text"
                  value={returnFlightNumber}
                  onChange={(e) => setReturnFlightNumber(e.target.value)}
                  className="input"
                  placeholder="e.g., BA246"
                />
              </div>
              
              <div>
                <label className="label">Return Departure Time</label>
                <input
                  type="text"
                  value={returnDepartureTime}
                  onChange={(e) => setReturnDepartureTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 15:30"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {deliveryType === 'ACCOMMODATION' && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Home size={20} />
            Accommodation Delivery Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Arrival/Check-in Time</label>
              <input
                type="text"
                value={accommodationArrival}
                onChange={(e) => setAccommodationArrival(e.target.value)}
                className="input"
                placeholder="e.g., 2024-07-15 at 14:00 or Flight BA245 arriving 15:30"
              />
            </div>
            
            <div>
              <label className="label">Departure Time</label>
              <input
                type="text"
                value={accommodationDeparture}
                onChange={(e) => setAccommodationDeparture(e.target.value)}
                className="input"
                placeholder="e.g., 2024-07-22 at 11:00 or Flight BA246 departing 15:30"
              />
            </div>
          </div>
        </div>
      )}

      {deliveryType === 'DUAL' && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Truck size={20} />
            Dual Delivery - Airport & Accommodation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide details for both the airport delivery and accommodation delivery.
          </p>
          
          {/* Airport fields */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium">Airport Delivery (Car Seats):</h4>
            <div>
              <label className="label">Outbound Airport *</label>
              <select
                value={outboundAirport}
                onChange={(e) => setOutboundAirport(e.target.value)}
                className="input"
                required
              >
                <option value="">Select airport...</option>
                {spanishAirports.map((airport) => (
                  <option key={airport} value={airport}>
                    {airport}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Expected Arrival Time *</label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="input"
                placeholder="e.g., 15:30"
                required
              />
            </div>
            <div>
              <label className="label">Onward Journey *</label>
              <select
                value={onwardJourney}
                onChange={(e) => setOnwardJourney(e.target.value)}
                className="input"
                required
              >
                <option value="">Select...</option>
                <option value="CAR_HIRE">Car Hire</option>
                <option value="TAXI">Taxi</option>
                <option value="PRIVATE_TRANSFER">Private Transfer</option>
                <option value="FRIEND_FAMILY">Friend/Family Pick-up</option>
              </select>
            </div>
          </div>
          
          {/* Accommodation fields */}
          <div className="space-y-4">
            <h4 className="font-medium">Accommodation Delivery (Other Items):</h4>
            <div>
              <label className="label">Arrival/Check-in Time *</label>
              <input
                type="text"
                value={accommodationArrival}
                onChange={(e) => setAccommodationArrival(e.target.value)}
                className="input"
                placeholder="e.g., 2024-07-15 at 14:00"
                required
              />
            </div>
            <div>
              <label className="label">Departure Time *</label>
              <input
                type="text"
                value={accommodationDeparture}
                onChange={(e) => setAccommodationDeparture(e.target.value)}
                className="input"
                placeholder="e.g., 2024-07-22 at 11:00"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1"
          required
        />
        <label htmlFor="terms" className="text-sm">
          I accept the{' '}
          <a href="/terms" target="_blank" className="text-primary-600 hover:underline">
            Terms & Conditions
          </a>
          {' '}and confirm that all information provided is accurate. *
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full text-lg py-3"
      >
        {loading ? 'Submitting...' : 'Submit Booking Request'}
      </button>
    </form>
  )
}

