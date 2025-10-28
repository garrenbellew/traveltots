export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
      
      <div className="prose max-w-none">
        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Booking & Payment</h2>
          <p className="mb-4">
            By submitting a booking request, you agree to hire the equipment for the specified rental period. Payment is required upon confirmation of the order. We accept cash and bank transfers.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Rental Period</h2>
          <p className="mb-4">
            The rental period begins on the delivery date and ends on the collection date. Equipment must be ready for collection at the agreed time and location. Late returns may incur additional charges.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Equipment Condition</h2>
          <p className="mb-4">
            All equipment is provided in good working condition and has been safety checked. You are responsible for the equipment during the rental period and must report any damage immediately. Equipment must be returned in the same condition, allowing for reasonable wear and tear.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Liability</h2>
          <p className="mb-4">
            While all equipment is maintained to the highest safety standards, Travel Tots cannot be held responsible for any injury or accident resulting from the misuse of rented equipment. Customers are advised to ensure proper installation and use of all items.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cancellations</h2>
          <p className="mb-4">
            Cancellations made more than 48 hours before the rental start date will receive a full refund. Cancellations within 48 hours may incur charges. We understand that travel plans can change, so please contact us as soon as possible to discuss your situation.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Damages & Loss</h2>
          <p className="mb-4">
            In the event of damage, loss, or theft of equipment, customers are liable for repair or replacement costs. These costs will be discussed and agreed upon before any charges are applied.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
          <p className="mb-4">
            For any questions or concerns regarding these terms, please contact us at info@traveltots.es or through our contact page.
          </p>
        </section>
      </div>
    </div>
  )
}

