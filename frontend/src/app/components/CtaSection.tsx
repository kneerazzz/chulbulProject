import React from "react"

const CtaSection = () => {
    return (
        <section className="bg-black text-white py-20 border-t border-gray-800">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Ready to accelerate your skills?
                </h2>
                <p className="text-gray-400 mb-8 text-[15px] max-w-xl mx-auto">
                Join SkillSprint and build consistent habits, track your progress, and level up your learning journey — one day at a time.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                <a
                    href="/signup"
                    className="bg-white text-black text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                    Get Started
                </a>
                <a
                    href="/about"
                    className="text-sm font-medium px-6 py-3 rounded-lg text-white hover:bg-gray-900 transition border border-gray-700"
                >
                    Learn More
                </a>
                </div>
            </div>
        </section>
    )
}

export default CtaSection;