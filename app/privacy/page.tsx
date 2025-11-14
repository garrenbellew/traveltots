import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Travel Tots baby equipment rental service. Learn how we collect, use, and protect your personal information in Los Alcázares, Spain.',
  openGraph: {
    title: 'Privacy Policy | Travel Tots',
    description: 'Privacy policy for Travel Tots baby equipment rental service.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'}/privacy`,
  },
}

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

export default async function PrivacyPage() {
  const contactInfo = await getContactInfo()
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-16" itemScope itemType="https://schema.org/PrivacyPolicy">
      <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-vacation-orange to-vacation-coral bg-clip-text text-transparent" itemProp="headline">
          🔒 Privacy Policy
        </h1>
        
        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">1. Information We Collect</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We collect information you provide directly to us when you make a booking, create an account, or contact us. This includes:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700">
            <li>Name and contact information (email, phone number)</li>
            <li>Delivery and collection addresses</li>
            <li>Rental dates and selected products</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Any messages or communications with our team</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">2. How We Use Your Information</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700">
            <li>Process and fulfill your bookings</li>
            <li>Communicate with you about your orders</li>
            <li>Send service updates and delivery notifications</li>
            <li>Improve our website and services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you promotional materials (with your consent)</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">3. Information Sharing</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700">
            <li>With delivery partners to fulfill your order</li>
            <li>When required by law or to protect our legal rights</li>
            <li>With your consent or at your request</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">4. Data Security</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We take appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your payment information is processed securely through trusted third-party payment providers.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">5. Your Rights</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700">
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
          <p className="mt-6 text-gray-700 leading-relaxed">
            To exercise these rights, please contact us at info@traveltots.es
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">6. Cookies & Tracking</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookies through your browser settings, though this may affect website functionality.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">7. Third-Party Links</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">8. Children's Privacy</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Our services are designed for parents and guardians. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">9. Changes to This Policy</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">10. Contact Us</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            If you have any questions about this privacy policy or our data practices, please contact us:
          </p>
          <div className="bg-vacation-sandLight rounded-xl p-6 space-y-3">
            <p className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">📧</span>
              <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:underline">
                {contactInfo.email}
              </a>
            </p>
            {contactInfo.phone && (
              <p className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">📞</span>
                <a href={`tel:${contactInfo.phone}`} className="text-primary-600 hover:underline">
                  {contactInfo.phone}
                </a>
              </p>
            )}
            <p className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">📍</span>
              <span>Los Alcázares, Spain</span>
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}

