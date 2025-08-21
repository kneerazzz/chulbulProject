// app/about/page.tsx
"use client";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-12">
      
      <h1 className="text-4xl font-bold mb-3">About SkillSprint</h1>
        <p className="text-xl font-bold text-red-600 mb-2">If u landed on this page on clicking any of those icons. I ain&apos;t building those pages. vroom vroom </p>
        <p className="text-xl font-bold text-red-600 mb-4">And yes i wrote this with AI. Don&apos;t come crying to me &quot;emmm u used ai to write /about page&quot;</p>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What is SkillSprint?</h2>
        <p>
          SkillSprint is a web application designed to help users plan, track, and accelerate their learning journey. 
          Whether you&apos;re a beginner or looking to level up your skills, SkillSprint gives you a structured yet flexible way 
          to grow.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Core Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Skill Plans:</strong> Create personal learning plans with target levels and durations.</li>
          <li><strong>Progress Tracking:</strong> Visual dashboards and summaries show your completed and remaining tasks.</li>
          <li><strong>AI Suggestions:</strong> Get personalized recommendations to improve and refine your learning path.</li>
          <li><strong>Notifications:</strong> Stay informed with reminders and updates about your plans.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <p>
          1. Choose a skill you want to improve. <br/>
          2. Set your target level and expected duration. <br/>
          3. Follow the plan and mark your progress as you go. <br/>
          4. Get AI insights and track improvements over time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Who is it for?</h2>
        <p>
          SkillSprint is ideal for students, hobbyists, and professionals who want to structure their learning, 
          monitor progress, and stay motivated. If you like seeing your growth in a tangible way, this app is for you.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tech Stack</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Frontend: Next.js, TypeScript, TailwindCSS</li>
          <li>Backend: Node.js, Express, Appwrite / MongoDB (depending on implementation)</li>
          <li>State Management: Zustand</li>
          <li>Cloud / Media: Cloudinary (for images & uploads)</li>
          <li>AI / ML Features: TensorFlow.js or custom API endpoints</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Getting Started</h2>
        <p>
          1. Sign up and create an account. <br/>
          2. Create your first skill plan. <br/>
          3. Track your progress daily or weekly. <br/>
          4. Review AI suggestions to optimize learning. <br/>
          5. Celebrate improvements and refine your next plan.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact / Support</h2>
        <p>
          For questions, bug reports, or feature requests, contact me at <strong>@kneerazzz</strong>.
        </p>
      </section>

    </main>
  );
}
