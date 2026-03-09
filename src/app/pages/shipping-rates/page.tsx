export default function ShippingRatesPage() {
  return (
    <div className="min-h-screen bg-navy px-4 py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="gold-glass rounded-2xl p-8 md:p-10 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Shipping Rates</h1>
          <p className="text-primary/80">Standard shipping is calculated at checkout.</p>
          <p className="text-primary/80 mt-2">Free shipping on eligible orders above PKR 3,000.</p>
        </div>
      </div>
    </div>
  )
}
