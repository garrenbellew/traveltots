import Link from 'next/link'
import { Package, Shield, Clock, Star, User, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-vacation-sandLight via-white to-orange-50 py-8 px-4 overflow-hidden">
        <div className="w-full mx-auto">
          <div className="flex justify-center items-center">
            {/* Travel Tots Logo Image */}
            <img 
              src="/logo.png" 
              alt="Travel Tots - Family at Airport" 
              className="w-full max-w-6xl h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Travel Tots?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-orange to-vacation-orangeLight w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Package className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Quality Equipment</h3>
              <p className="text-gray-600 leading-relaxed">Top-rated car seats, travel cots, and baby gear</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-ocean to-vacation-oceanLight w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">All equipment meets European safety standards</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-tropical to-emerald-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Clock className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Flexible Rental</h3>
              <p className="text-gray-600 leading-relaxed">From a few days to several weeks</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-coral to-pink-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Star className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Great Service</h3>
              <p className="text-gray-600 leading-relaxed">Personalized service in Los Alcázares</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-vacation-sandLight to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Popular Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/products?category=car-seats" className="card hover:shadow-vacation transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-vacation-orange transition-colors">Car Seats</h3>
              <p className="text-gray-600 leading-relaxed">Safe and comfortable seats for all ages</p>
            </Link>
            <Link href="/products?category=travel-cots" className="card hover:shadow-vacation transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-vacation-ocean transition-colors">Travel Cots</h3>
              <p className="text-gray-600 leading-relaxed">Portable sleeping solutions for your little ones</p>
            </Link>
            <Link href="/products?category=prams" className="card hover:shadow-vacation transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-4">🛴</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-vacation-tropical transition-colors">Prams & Buggies</h3>
              <p className="text-gray-600 leading-relaxed">Easy strollers for exploring Spain</p>
            </Link>
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn btn-primary text-lg">
              🌟 View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Account Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-vacation-ocean to-vacation-oceanDark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <User className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Create Your Account</h2>
          <p className="text-xl mb-10 text-white/90">
            Track your orders, message our team, and manage your rental bookings
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-orange" />
                <h3 className="font-bold text-xl">Order Tracking</h3>
              </div>
              <p className="text-primary-100">View all your orders and their status in one place</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-coral" />
                <h3 className="font-bold text-xl">Direct Messaging</h3>
              </div>
              <p className="text-white/80">Message our team directly about your orders</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-tropical" />
                <h3 className="font-bold text-xl">Easy Cancellation</h3>
              </div>
              <p className="text-white/80">Cancel or modify orders from your dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/customer/register" className="btn bg-white text-vacation-ocean hover:bg-vacation-sandLight text-lg px-10 shadow-lg font-bold">
              ✨ Create Free Account
            </Link>
            <Link href="/customer/login" className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-10 font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

