// app/components/ProductPreview.tsx
'use client'

const ProductPreview = () => {
  return (
    <section className="bg-black py-24 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your learning, visualized.
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-12">
          Track your SkillPlan progress, review completed topics, and stay accountable with a clean, responsive dashboard.
        </p>

        {/* Product Image */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 max-w-4xl mx-auto">
          <img 
            src="/assets/dashboard.png" // Replace with actual dashboard image
            alt="SkillSprint Dashboard Preview"
            className="w-full object-cover"
          />
        </div>

      </div>
    </section>
  )
}

export default ProductPreview
