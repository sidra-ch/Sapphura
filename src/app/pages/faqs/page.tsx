export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-navy px-4 py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="gold-glass rounded-2xl p-8 md:p-10 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">FAQs</h1>
          <div className="space-y-5 text-primary/85">
            <div>
              <h2 className="font-semibold text-primary">How long is delivery time?</h2>
              <p>Usually 3-5 working days in major cities.</p>
            </div>
            <div>
              <h2 className="font-semibold text-primary">Do you offer COD?</h2>
              <p>Yes, cash on delivery is available across Pakistan.</p>
            </div>
            <div>
              <h2 className="font-semibold text-primary">Can I exchange an item?</h2>
              <p>Yes, please review our exchange policy page for details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
