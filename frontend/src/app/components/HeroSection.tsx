

const HeroSection = () => {
    return (
        <section className="relative h-screen w-full bg-black text-white overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <img
                src="/assets/skillSprint.jpg" // Replace with your image
                alt="Background"
                className="object-cover w-full h-full opacity-20"
                />
            </div>

            {/* Overlay content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
                <h1 className="text-5xl md:text-6xl font-bold max-w-3xl leading-tight">
                Build Smarter. Learn Faster.
                </h1>
                <p className="text-gray-400 text-lg mt-4 max-w-xl">
                SkillSprint helps you create custom skill plans with AI. Level up your future.
                </p>
                <div className="mt-8 flex gap-4">
                <button className="bg-white text-black px-6 py-3 rounded-lg cursor-pointer font-semibold hover:bg-gray-200 transition-all">
                    Get Started
                </button>
                <button className="border cursor-pointer border-gray-500 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all">
                    Explore Features
                </button>
                </div>
            </div>
        </section>

    )
}

export default HeroSection;