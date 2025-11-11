import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getContactInfo() {
  try {
    const admin = await prisma.admin.findFirst()
    return {
      email: admin?.contactEmail || 'info@traveltots.es',
      phone: admin?.contactPhone || null,
    }
  } catch (error) {
    return {
      email: 'info@traveltots.es',
      phone: null,
    }
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-700 mb-8">
            We're here to help! If you have any questions about our products, need assistance with your booking, or want to discuss special requirements, please don't hesitate to reach out.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:underline">
                {contactInfo.email}
              </a>
            </div>
            
            {contactInfo.phone && (
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-primary-600 hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-700">Los Alcázares, Spain</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-700">
                Monday - Saturday: 9:00 AM - 7:00 PM<br />
                Sunday: By appointment
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Browse & Select</h3>
                <p className="text-gray-700 text-sm">Browse our catalog and select the items you need for your rental period.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit Request</h3>
                <p className="text-gray-700 text-sm">Fill out our simple booking form with your details and preferred dates.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Confirm & Pay</h3>
                <p className="text-gray-700 text-sm">We'll contact you within 24 hours to confirm availability and arrange payment.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Delivery & Collection</h3>
                <p className="text-gray-700 text-sm">We deliver directly to your accommodation and collect at the end of your rental.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

